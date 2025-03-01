document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scheduleForm');
    const entriesContainer = document.getElementById('entriesContainer');
    
    // Fungsi-fungsi
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
        
        const time = document.getElementById('timeInput').value;
        const activity = document.getElementById('activityInput').value;

        if (time && activity) {
            createEntry(formatTime(time), activity);
            form.reset();
            saveToCookie();
        }
    });
    loadFromCookie();
});

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function takeScreenshot() {
    html2canvas(document.querySelector('.container'), {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: false,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'daily-schedule.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
}
