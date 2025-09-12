// Data is provided by data.js as window.PROPERTIES
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

    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const properties = Array.isArray(window.PROPERTIES) ? window.PROPERTIES : [];

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
        const states = getUniqueSorted(filtered.map(p => p.location.state));
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
        if (selectedState) filtered = filtered.filter(p => p.location.state === selectedState);
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
            const matchesState = !selectedState || p.location.state === selectedState;
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
                </div>
            `;
            card.addEventListener('click', () => openDetailModal(p));
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
        modalMetaEl.textContent = `${p.location.city}, ${p.location.state}, ${p.location.country} · ${p.address}`;
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

    // Initialize
    populateCountries();
    populateStates();
    populateCities();
    populateAmenities();
    applyFiltersAndRender();
})();

