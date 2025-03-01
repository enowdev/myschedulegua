document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scheduleForm');
    const entriesContainer = document.getElementById('entriesContainer');
    
    function saveToCookie() {
        const entries = [];
        document.querySelectorAll('.entry-row').forEach(entry => {
            entries.push({
                time: entry.querySelector('.time').textContent,
                activity: entry.querySelector('.activity').textContent
            });
        });
        
        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = `scheduleEntries=${JSON.stringify(entries)}; expires=${date.toUTCString()}; path=/`;
    }

    function loadFromCookie() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('scheduleEntries='))
            ?.split('=')[1];
            
        if (cookieValue) {
            JSON.parse(decodeURIComponent(cookieValue)).forEach(entry => {
                createEntry(entry.time, entry.activity);
            });
        }
    }

    function createEntry(time, activity) {
        const entry = document.createElement('div');
        entry.className = 'entry-row';
        entry.innerHTML = `
            <div class="time">${time}</div>
            <div class="activity">${activity}</div>
        `;
        
        addDeleteButton(entry);
        entriesContainer.appendChild(entry);
    }

    function addDeleteButton(entry) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Hapus';
        deleteBtn.onclick = () => {
            entry.remove();
            saveToCookie();
        };
        entry.appendChild(deleteBtn);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let hours = document.getElementById('hoursInput').value.padStart(2, '0');
        let minutes = document.getElementById('minutesInput').value.padStart(2, '0');

        if (hours === '24') {
            minutes = '00';
            minutesInput.value = '00';
        }
        
        const time = `${hours}:${minutes}`;
        const activity = document.getElementById('activityInput').value;

        if ((hours && minutes && activity) || (hours === '24' && activity)) {
            createEntry(time, activity);
            form.reset();
            saveToCookie();
            document.getElementById('minutesInput').disabled = false;
        }
    });
    
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    
    function restrictToNumbers(input) {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 2) {
                this.value = this.value.slice(0, 2);
            }
            if (this === hoursInput && parseInt(this.value) > 24) {
                this.value = '24';
            }
            if (this === minutesInput && parseInt(this.value) > 59) {
                this.value = '59';
            }
            if (this === hoursInput && parseInt(this.value) === 24) {
                minutesInput.value = '00';
                minutesInput.disabled = true;
            } else if (this === hoursInput) {
                minutesInput.disabled = false;
            }
        });
    }
    
    restrictToNumbers(hoursInput);
    restrictToNumbers(minutesInput);
    
    loadFromCookie();
});

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function takeScreenshot() {
    const container = document.querySelector('.container');
    
    html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: false,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-schedule-gua.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
}
