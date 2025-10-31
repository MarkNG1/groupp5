// Dynamic property loading from PHP backend
(function () {
    const countrySelect = document.getElementById('countrySelect');
    const stateSelect = document.getElementById('stateSelect');
    const citySelect = document.getElementById('citySelect');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const cardsEl = document.getElementById('cards');
    const resultsCountEl = document.getElementById('resultsCount');
    const yearEl = document.getElementById('year');
    const priceMinEl = document.getElementById('priceMin');
    const priceMaxEl = document.getElementById('priceMax');
    const ratingSelect = document.getElementById('ratingSelect');
    const amenitiesWrap = document.getElementById('amenitiesWrap');
    const clearFiltersBtn = document.getElementById('clearFilters');

    // Modal elements
    const modalEl = document.getElementById('detailModal');
    const modalTitleEl = document.getElementById('modalTitle');
    const modalMetaEl = document.getElementById('modalMeta');
    const modalPriceEl = document.getElementById('modalPrice');
    const modalAmenitiesEl = document.getElementById('modalAmenities');
    const modalDescEl = document.getElementById('modalDesc');
    const modalImgEl = document.getElementById('modalPhoto');
    let modalPhotoIndex = 0;

    // Booking modal elements
    const bookingModalEl = document.getElementById('bookingModal');
    const bookingFormEl = document.getElementById('bookingForm');
    const bookPropertyBtn = document.getElementById('bookPropertyBtn');
    const bookingPropertyInfoEl = document.getElementById('bookingPropertyInfo');
    const summaryPropertyNameEl = document.getElementById('summaryPropertyName');
    const summaryPriceEl = document.getElementById('summaryPrice');
    const summaryTotalEl = document.getElementById('summaryTotal');
    let currentBookingProperty = null;

    // Map and view elements
    const listViewBtn = document.getElementById('listViewBtn');
    const mapViewBtn = document.getElementById('mapViewBtn');
    const mapContainerEl = document.getElementById('mapContainer');
    const mapEl = document.getElementById('map');
    let currentView = 'list';
    let map = null;
    let markers = [];

    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    let properties = [];

    // Load properties from serverless backend
    async function loadProperties() {
        try {
            const response = await fetch('/.netlify/functions/get-properties');
            const data = await response.json();
            if (Array.isArray(data)) {
                properties = data;
                populateCountries();
                populateStates();
                populateCities();
                populateAmenities();
                applyFiltersAndRender();
            } else {
                console.error('Failed to load properties:', data.error);
            }
        } catch (error) {
            console.error('Error loading properties:', error);
            // fallback to static data if backend fails - saved my life during development
            properties = Array.isArray(window.PROPERTIES) ? window.PROPERTIES : [];
            populateCountries();
            populateStates();
            populateCities();
            populateAmenities();
            applyFiltersAndRender();
        }
    }

    const getUniqueSorted = (arr) => Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));

    function populateCountries() {
        if (!countrySelect) return;
        const countries = getUniqueSorted(properties.map(p => p.location.country));
        for (const country of countries) {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        }
        if (stateSelect) stateSelect.disabled = countries.length === 0;
        if (citySelect) citySelect.disabled = true;
    }

    function populateAmenities() {
        if (!amenitiesWrap) return;
        amenitiesWrap.innerHTML = '';
        const all = properties.flatMap(p => Array.isArray(p.amenities) ? p.amenities : []);
        const unique = getUniqueSorted(all);
        for (const amenity of unique) {
            const id = `amenity-${amenity.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            const label = document.createElement('label');
            label.className = 'chip';
            label.setAttribute('for', id);
            label.innerHTML = `<input id="${id}" type="checkbox" value="${amenity}"><span>${amenity}</span>`;
            amenitiesWrap.appendChild(label);
        }
        amenitiesWrap.addEventListener('change', applyFiltersAndRender);
    }

    function populateStates() {
        // If there is no state selector in the DOM, directly populate cities based on country
        if (!stateSelect) {
            if (!citySelect) return; // no state or city selectors
            clearOptions(citySelect, 'All cities');
            const selectedCountry = countrySelect ? countrySelect.value : '';
            let filtered = properties;
            if (selectedCountry) filtered = filtered.filter(p => p.location.country === selectedCountry);
            const cities = getUniqueSorted(filtered.map(p => p.location.city));
            for (const city of cities) {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            }
            citySelect.disabled = cities.length === 0;
            return;
        }

        clearOptions(stateSelect, 'All states/regions');
        if (citySelect) clearOptions(citySelect, 'All cities');

        const selectedCountry = countrySelect.value;
        const filtered = selectedCountry ? properties.filter(p => p.location.country === selectedCountry) : properties;
        const states = getUniqueSorted(filtered.map(p => p.location.state || p.location.city).filter(Boolean));
        for (const state of states) {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        }
        stateSelect.disabled = states.length === 0;
        if (citySelect) citySelect.disabled = true;
    }

    function populateCities() {
        if (!citySelect) return;
        clearOptions(citySelect, 'All cities');
        const selectedCountry = countrySelect ? countrySelect.value : '';
        const selectedState = stateSelect ? stateSelect.value : '';
        let filtered = properties;
        if (selectedCountry) filtered = filtered.filter(p => p.location.country === selectedCountry);
        if (selectedState) filtered = filtered.filter(p => (p.location.state || p.location.city) === selectedState);
        const cities = getUniqueSorted(filtered.map(p => p.location.city));
        for (const city of cities) {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        }
        citySelect.disabled = cities.length === 0;
    }

    function clearOptions(select, placeholder) {
        select.innerHTML = '';
        const base = document.createElement('option');
        base.value = '';
        base.textContent = placeholder;
        select.appendChild(base);
    }

    function applyFiltersAndRender() {
        const query = searchInput.value.trim().toLowerCase();
        const selectedCountry = countrySelect ? countrySelect.value : '';
        const selectedState = stateSelect ? stateSelect.value : '';
        const selectedCity = citySelect ? citySelect.value : '';
        const sortBy = sortSelect.value;
        const priceMin = Number(priceMinEl && priceMinEl.value) || 0;
        const priceMax = Number(priceMaxEl && priceMaxEl.value) || Number.POSITIVE_INFINITY;
        const minRating = Number(ratingSelect && ratingSelect.value) || 0;
        const selectedAmenities = Array.from(amenitiesWrap ? amenitiesWrap.querySelectorAll('input[type="checkbox"]:checked') : [])
            .map((el) => el.value);

        let filtered = properties.filter(p => {
            const matchesCountry = !selectedCountry || p.location.country === selectedCountry;
            const matchesState = !selectedState || (p.location.state || p.location.city) === selectedState;
            const matchesCity = !selectedCity || p.location.city === selectedCity;
            const matchesQuery = !query ||
                p.name.toLowerCase().includes(query) ||
                p.address.toLowerCase().includes(query) ||
                p.location.city.toLowerCase().includes(query);
            const withinPrice = (p.price >= priceMin) && (p.price <= priceMax);
            const meetsRating = (typeof p.rating === 'number' ? p.rating : 0) >= minRating;
            const hasAmenities = selectedAmenities.length === 0 || selectedAmenities.every(a => (p.amenities || []).includes(a));
            return matchesCountry && matchesState && matchesCity && matchesQuery && withinPrice && meetsRating && hasAmenities;
        });

        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        renderCards(filtered);
        updateMapMarkers(filtered);
    }

    function renderCards(items) {
        cardsEl.innerHTML = '';
        resultsCountEl.textContent = `${items.length} ${items.length === 1 ? 'result' : 'results'}`;
        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'card';
            empty.innerHTML = '<div class="body"><div class="name">No properties found</div><div class="meta">Try adjusting your filters.</div></div>';
            cardsEl.appendChild(empty);
            return;
        }
        for (const p of items) {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="media">${p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">` : 'No image'}</div>
                <div class="body">
                    <div class="name">${p.name}</div>
                    <div class="meta">${p.address}${p.rating ? ` · ⭐ ${p.rating.toFixed(1)}` : ''}</div>
                    <div class="meta details-row"><span class="price">KSh ${formatPrice(p.price)}</span><span class="beds">${p.beds} beds</span><span class="baths">${p.baths} baths</span></div>
                    <div class="card-actions">
                        <button class="btn primary small" data-book-property="${p.id}">Book Now</button>
                    </div>
                </div>
            `;
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on booking button
                if (!e.target.closest('[data-book-property]')) {
                    openDetailModal(p);
                }
            });
            cardsEl.appendChild(card);
        }
    }

    function formatPrice(num) {
        const n = Number(num);
        if (!Number.isFinite(n)) return String(num);
        return String(Math.round(n));
    }

    if (countrySelect) {
        countrySelect.addEventListener('change', () => {
            populateStates();
            applyFiltersAndRender();
        });
    }

    if (stateSelect) {
        stateSelect.addEventListener('change', () => {
            populateCities();
            applyFiltersAndRender();
        });
    }

    if (citySelect) citySelect.addEventListener('change', applyFiltersAndRender);
    searchInput.addEventListener('input', debounce(applyFiltersAndRender, 150));
    sortSelect.addEventListener('change', applyFiltersAndRender);
    if (priceMinEl) priceMinEl.addEventListener('input', debounce(applyFiltersAndRender, 150));
    if (priceMaxEl) priceMaxEl.addEventListener('input', debounce(applyFiltersAndRender, 150));
    if (ratingSelect) ratingSelect.addEventListener('change', applyFiltersAndRender);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => {
        if (countrySelect) countrySelect.value = '';
        if (stateSelect) stateSelect.value = '';
        if (citySelect) citySelect.value = '';
        searchInput.value = '';
        if (priceMinEl) priceMinEl.value = '';
        if (priceMaxEl) priceMaxEl.value = '';
        if (ratingSelect) ratingSelect.value = '0';
        if (amenitiesWrap) Array.from(amenitiesWrap.querySelectorAll('input[type="checkbox"]')).forEach(el => { el.checked = false; });
        populateStates();
        if (citySelect) populateCities();
        applyFiltersAndRender();
    });

    function debounce(fn, wait) {
        let t;
        return function () {
            clearTimeout(t);
            const args = arguments;
            t = setTimeout(() => fn.apply(null, args), wait);
        };
    }

    // Modal helpers
    function openDetailModal(p) {
        if (!modalEl) return;
        modalEl.setAttribute('aria-hidden', 'false');
        modalTitleEl.textContent = p.name;
        modalMetaEl.textContent = `${p.location.city}, ${p.location.country} · ${p.address}`;
        modalPriceEl.innerHTML = `<span class="price">KSh ${formatPrice(p.price)} / mo</span><span class="beds">${p.beds} beds</span><span class="baths">${p.baths} baths</span>${p.rating ? `<span class="rating">⭐ ${p.rating.toFixed(1)}</span>` : ''}`;
        modalDescEl.textContent = p.description || '';
        modalAmenitiesEl.innerHTML = '';
        (p.amenities || []).forEach(a => {
            const span = document.createElement('span');
            span.className = 'chip-badge';
            span.textContent = a;
            modalAmenitiesEl.appendChild(span);
        });
        const photos = Array.isArray(p.photos) && p.photos.length ? p.photos : (p.thumbnail ? [p.thumbnail] : []);
        modalPhotoIndex = 0;
        setModalPhoto(photos, 0);

        const prevBtn = modalEl.querySelector('.carousel-btn.prev');
        const nextBtn = modalEl.querySelector('.carousel-btn.next');
        const closeEls = modalEl.querySelectorAll('[data-close]');
        const onPrev = () => { if (!photos.length) return; modalPhotoIndex = (modalPhotoIndex - 1 + photos.length) % photos.length; setModalPhoto(photos, modalPhotoIndex); };
        const onNext = () => { if (!photos.length) return; modalPhotoIndex = (modalPhotoIndex + 1) % photos.length; setModalPhoto(photos, modalPhotoIndex); };
        const onClose = () => closeDetailModal();
        prevBtn.onclick = onPrev;
        nextBtn.onclick = onNext;
        closeEls.forEach(el => el.addEventListener('click', onClose, { once: true }));
        document.addEventListener('keydown', escToClose, { once: true });

        function escToClose(e) { if (e.key === 'Escape') onClose(); }
    }

    function setModalPhoto(photos, index) {
        if (!modalImgEl) return;
        if (!photos.length) {
            modalImgEl.alt = 'No image';
            modalImgEl.removeAttribute('src');
            return;
        }
        modalImgEl.src = photos[index];
        modalImgEl.alt = `Photo ${index + 1} of ${photos.length}`;
    }

    function closeDetailModal() {
        if (!modalEl) return;
        modalEl.setAttribute('aria-hidden', 'true');
    }

    // Booking functionality
    function openBookingModal(property) {
        if (!bookingModalEl) return;
        currentBookingProperty = property;
        
        // Set property info in booking modal
        bookingPropertyInfoEl.textContent = `${property.name} - ${property.address}`;
        summaryPropertyNameEl.textContent = property.name;
        summaryPriceEl.textContent = `KSh ${formatPrice(property.price)}/month`;
        
        // Calculate estimated total (assuming 1 month for now)
        const total = property.price;
        summaryTotalEl.textContent = `KSh ${formatPrice(total)}`;
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const checkInInput = document.getElementById('checkIn');
        const checkOutInput = document.getElementById('checkOut');
        
        checkInInput.min = today;
        checkOutInput.min = today;
        
        // Update check-out minimum when check-in changes
        checkInInput.addEventListener('change', function() {
            if (this.value) {
                checkOutInput.min = this.value;
                // Clear check-out if it's before the new check-in date
                if (checkOutInput.value && checkOutInput.value <= this.value) {
                    checkOutInput.value = '';
                }
            }
        });
        
        // Reset form
        bookingFormEl.reset();
        
        // Show modal
        bookingModalEl.setAttribute('aria-hidden', 'false');
        
        // Add event listeners for close buttons
        const closeEls = bookingModalEl.querySelectorAll('[data-close]');
        const onClose = () => closeBookingModal();
        closeEls.forEach(el => el.addEventListener('click', onClose, { once: true }));
        document.addEventListener('keydown', escToClose, { once: true });
        
        function escToClose(e) { if (e.key === 'Escape') onClose(); }
    }

    function closeBookingModal() {
        if (!bookingModalEl) return;
        bookingModalEl.setAttribute('aria-hidden', 'true');
        currentBookingProperty = null;
    }

    function handleBookingSubmit(e) {
        e.preventDefault();
        
        if (!currentBookingProperty) return;
        
        const formData = new FormData(bookingFormEl);
        const bookingData = {
            property: currentBookingProperty,
            guestName: formData.get('guestName'),
            guestEmail: formData.get('guestEmail'),
            guestPhone: formData.get('guestPhone'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut'),
            guests: formData.get('guests'),
            specialRequests: formData.get('specialRequests'),
            bookingDate: new Date().toISOString(),
            status: 'pending'
        };
        
        // Validate dates
        const checkInDate = new Date(bookingData.checkIn);
        const checkOutDate = new Date(bookingData.checkOut);
        
        if (checkOutDate <= checkInDate) {
            alert('Check-out date must be after check-in date');
            return;
        }
        
        // Calculate total cost
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const monthlyRate = currentBookingProperty.price;
        const totalCost = Math.ceil((nights / 30) * monthlyRate); // Rough calculation
        
        // Show confirmation
        const confirmed = confirm(`Confirm booking for ${currentBookingProperty.name}?\n\nGuest: ${bookingData.guestName}\nCheck-in: ${bookingData.checkIn}\nCheck-out: ${bookingData.checkOut}\nTotal: KSh ${formatPrice(totalCost)}`);
        
        if (confirmed) {
            // Submit booking to backend
            submitBooking(bookingData);
        }
    }

    // Map and view functionality
    function initMap() {
        if (!mapEl) {
            console.log('Map element not found');
            return;
        }
        
        if (typeof L === 'undefined') {
            console.log('Leaflet not loaded');
            mapEl.innerHTML = '<div class="map-fallback"><div class="map-message"><div class="map-icon">🗺️</div><h3>Map Loading...</h3><p>Please wait while the map loads</p></div></div>';
            return;
        }
        
        console.log('Initializing map...');
        
        // Initialize Leaflet map centered on Murang'a, Kenya
        const murangaCoords = [-0.7200, 37.1500]; // Murang'a coordinates
        map = L.map('map').setView(murangaCoords, 13);
        
        // Add OpenStreetMap tiles with dark theme
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }).addTo(map);
        
        console.log('Map initialized successfully');
        
        // Add property markers
        addPropertyMarkers(properties);
        
        // Add map info overlay
        const mapInfo = L.control({position: 'bottomleft'});
        mapInfo.onAdd = function() {
            const div = L.DomUtil.create('div', 'map-info-overlay');
            div.innerHTML = '📍 Click on markers to view property details';
            return div;
        };
        mapInfo.addTo(map);
    }
    
    function addPropertyMarkers(properties) {
        if (!map) return;
        
        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        properties.forEach(property => {
            if (property.coordinates) {
                // Create custom marker icon
                const markerIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `
                        <div class="marker-pin">
                            <div class="marker-icon">🏠</div>
                            <div class="marker-price">KSh ${formatPrice(property.price)}</div>
                        </div>
                    `,
                    iconSize: [60, 40],
                    iconAnchor: [30, 40],
                    popupAnchor: [0, -40]
                });
                
                // Create marker
                const marker = L.marker([property.coordinates.lat, property.coordinates.lng], {
                    icon: markerIcon,
                    propertyId: property.id
                }).addTo(map);
                
                // Add popup with property info
                marker.bindPopup(`
                    <div class="map-popup">
                        <h3>${property.name}</h3>
                        <p class="popup-address">${property.address}</p>
                        <p class="popup-price">KSh ${formatPrice(property.price)}/month</p>
                        <p class="popup-details">${property.beds} beds • ${property.baths} baths</p>
                        <button class="popup-btn" onclick="window.openPropertyDetails('${property.id}')">
                            View Details
                        </button>
                    </div>
                `);
                
                markers.push(marker);
            }
        });
    }
    
    // Global function for popup buttons
    window.openPropertyDetails = function(propertyId) {
        const property = properties.find(p => p.id === propertyId);
        if (property) {
            openDetailModal(property);
        }
    };

    function switchView(view) {
        currentView = view;
        
        if (view === 'list') {
            cardsEl.style.display = 'grid';
            mapContainerEl.style.display = 'none';
            listViewBtn.classList.add('active');
            mapViewBtn.classList.remove('active');
        } else if (view === 'map') {
            cardsEl.style.display = 'none';
            mapContainerEl.style.display = 'block';
            listViewBtn.classList.remove('active');
            mapViewBtn.classList.add('active');
            
            // Initialize map if not already done
            if (!map) {
                // Small delay to ensure container is visible
                setTimeout(() => {
                    initMap();
                }, 100);
            }
        }
    }

    function updateMapMarkers(filteredProperties) {
        if (!map || currentView !== 'map') return;
        
        // Update markers based on filtered properties
        markers.forEach(marker => {
            const propertyId = marker.options.propertyId;
            const isVisible = filteredProperties.some(p => p.id === propertyId);
            
            if (isVisible) {
                map.addLayer(marker);
            } else {
                map.removeLayer(marker);
            }
        });
    }

    // Add view toggle event listeners
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => switchView('list'));
    }

    if (mapViewBtn) {
        mapViewBtn.addEventListener('click', () => switchView('map'));
    }

    // Add booking event listeners
    if (bookPropertyBtn) {
        bookPropertyBtn.addEventListener('click', () => {
            if (currentBookingProperty) {
                openBookingModal(currentBookingProperty);
            }
        });
    }

    if (bookingFormEl) {
        bookingFormEl.addEventListener('submit', handleBookingSubmit);
    }

    // Add event delegation for booking buttons on cards
    if (cardsEl) {
        cardsEl.addEventListener('click', (e) => {
            const bookBtn = e.target.closest('[data-book-property]');
            if (bookBtn) {
                e.stopPropagation();
                const propertyId = bookBtn.getAttribute('data-book-property');
                const property = properties.find(p => p.id === propertyId);
                if (property) {
                    openBookingModal(property);
                }
            }
        });
    }

    // Update openDetailModal to set currentBookingProperty
    const originalOpenDetailModal = openDetailModal;
    openDetailModal = function(p) {
        currentBookingProperty = p;
        originalOpenDetailModal(p);
    };

    // Booking submission function
    async function submitBooking(bookingData) {
        try {
            const response = await fetch('/.netlify/functions/create-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    property_id: bookingData.property.id,
                    guest_name: bookingData.guestName,
                    guest_email: bookingData.guestEmail,
                    guest_phone: bookingData.guestPhone,
                    check_in: bookingData.checkIn,
                    check_out: bookingData.checkOut,
                    guests: bookingData.guests,
                    special_requests: bookingData.specialRequests
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Booking request submitted successfully! We will contact you soon to confirm your reservation.');
                closeBookingModal();
            } else {
                alert('Error submitting booking: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            alert('Error submitting booking: ' + error.message);
        }
    }

    // Initialize - load properties from backend
    loadProperties();
})();

// Navigation helper functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showAbout() {
    alert(`About Murang'a Properties

A student-built platform connecting the Murang'a University community with quality accommodation options.

Features:
• Browse properties near campus
• Interactive map view
• Easy booking system
• Host dashboard for property owners

Built as a learning project to help students find housing.`);
}

function showContact() {
    alert(`Contact Information

📧 Email: info@murangaproperties.com
📱 Phone: +254 700 000 000
📍 Location: Murang'a University Area

For property inquiries or technical support, feel free to reach out!`);
}

// Navigation helper functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

