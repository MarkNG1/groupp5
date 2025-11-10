// Host dashboard JavaScript - External file to prevent text leakage

document.addEventListener('DOMContentLoaded', function() {
    // Host dashboard functionality
    const form = document.getElementById('addPropertyForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            const amenities = Array.from(document.querySelectorAll('.amenities input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            data.amenities = amenities;
            
            const photosText = data.photos || '';
            data.photos = photosText.split('\n').filter(url => url.trim()).map(url => url.trim());
            
            data.price = parseFloat(data.price);
            data.beds = parseInt(data.beds);
            data.baths = parseInt(data.baths);
            if (data.latitude) data.latitude = parseFloat(data.latitude);
            if (data.longitude) data.longitude = parseFloat(data.longitude);
            
            try {
                const response = await fetch('add_property.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Property added successfully!');
                    this.reset();
                } else {
                    alert('Error: ' + (result.error || 'Failed to add property'));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
});

function showAbout() {
    alert('About Murang\'a Properties\n\nA student-built platform for the Murang\'a University community.\n\nFeatures:\n- Browse properties near campus\n- Interactive map view\n- Easy booking system\n- Host dashboard for property owners\n\nBuilt as a learning project to help students find housing.');
}