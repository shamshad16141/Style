// @ts-nocheck
(() => {
        // Check if user is logged in
        window.addEventListener('DOMContentLoaded', () => {
            const user = getUserFromSession();
            if (!user) {
                window.location.href = '/login.html';
                return;
            }

            initializeBooking();
        });

        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');
            successDiv.style.display = 'none';
            successDiv.classList.remove('success');
            errorDiv.textContent = message;
            errorDiv.classList.remove('success');
            errorDiv.classList.add('error');
            errorDiv.style.display = 'block';
        }

        function showSuccess(message) {
            const successDiv = document.getElementById('successMessage');
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.style.display = 'none';
            errorDiv.classList.remove('error');
            successDiv.textContent = message;
            successDiv.classList.remove('error');
            successDiv.classList.add('success');
            successDiv.style.display = 'block';
        }

        function initializeBooking() {
            // Calendar logic
            const monthDisplay = document.getElementById('monthYearDisplay');
            const daysGrid = document.getElementById('daysGrid');
            const prevBtn = document.getElementById('prevMonth');
            const nextBtn = document.getElementById('nextMonth');

            let currentDate = new Date();
            currentDate.setDate(15);

            function renderCalendar() {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const firstDay = new Date(year, month, 1);
                const startDayOfWeek = firstDay.getDay();
                let offset = (startDayOfWeek === 0) ? 6 : startDayOfWeek - 1;
                const daysInMonth = new Date(year, month + 1, 0).getDate();

                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                monthDisplay.innerText = monthNames[month] + ' ' + year;

                let gridHtml = '';

                // Empty cells
                for (let i = 0; i < offset; i++) {
                    gridHtml += `<div class="day-cell empty"></div>`;
                }

                // Days of month
                for (let d = 1; d <= daysInMonth; d++) {
                    const cellDate = new Date(year, month, d);
                    const dayOfWeek = cellDate.getDay();
                    let isAvailable = false;
                    
                    if (dayOfWeek !== 0) {
                        if (dayOfWeek === 6) {
                            if (d === 9 || d === 16 || d === 23 || d === 30) isAvailable = true;
                        } else {
                            if (!(d === 5 || d === 12 || d === 20 || d === 27)) isAvailable = true;
                        }
                    }
                    
                    const availableClass = isAvailable ? 'available' : '';
                    gridHtml += `<div class="day-cell ${availableClass}" data-day="${d}" data-month="${month}" data-year="${year}">${d}</div>`;
                }

                const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
                const filledCells = offset + daysInMonth;
                for (let i = filledCells; i < totalCells; i++) {
                    gridHtml += `<div class="day-cell empty"></div>`;
                }

                daysGrid.innerHTML = gridHtml;

                // Attach click listeners
                document.querySelectorAll('.day-cell.available').forEach(cell => {
                    cell.addEventListener('click', function(e) {
                        document.querySelectorAll('.day-cell.selected').forEach(c => {
                            c.classList.remove('selected');
                        });
                        this.classList.add('selected');
                    });
                });
            }

            prevBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });

            nextBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });

            // Time selection
            const timeChips = document.querySelectorAll('.time-chip');
            timeChips.forEach(chip => {
                chip.addEventListener('click', function() {
                    timeChips.forEach(c => c.classList.remove('selected-time'));
                    this.classList.add('selected-time');
                });
            });

            // Button handler
            document.getElementById('confirmSlotBtn').addEventListener('click', async function() {
                const errorDiv = document.getElementById('errorMessage');
                const successDiv = document.getElementById('successMessage');
                errorDiv.style.display = 'none';
                successDiv.style.display = 'none';

                const selectedDayCell = document.querySelector('.day-cell.selected');
                const selectedTimeChip = document.querySelector('.time-chip.selected-time');

                if (!selectedDayCell || !selectedTimeChip) {
                    showError('Please select both a date and time');
                    return;
                }

                const day = selectedDayCell.dataset.day;
                const month = selectedDayCell.dataset.month;
                const year = selectedDayCell.dataset.year;
                const selectedDate = new Date(Number(year), Number(month), Number(day));
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dd = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;
                const time = selectedTimeChip.getAttribute('data-time');
                const user = getUserFromSession();
                const selectedService = sessionStorage.getItem('selectedService') || 'Haircut';

                try {
                    const bookingData = {
                        userId: user._id,
                        serviceName: selectedService,
                        date: dateStr,
                        time: time,
                        status: 'pending'
                    };

                    const response = await createBooking(bookingData);
                    
                    if (response._id || response.booking) {
                        const createdBooking = response.booking || response;
                        if (createdBooking && createdBooking._id) {
                            sessionStorage.setItem('latestBookingId', createdBooking._id);
                        }
                        showSuccess('Booking created! Redirecting...');
                        setTimeout(() => {
                            window.location.href = '/contactinfo.html';
                        }, 1500);
                    } else {
                        showError(response.message || 'Failed to create booking');
                    }
                } catch (error) {
                    showError('Error: ' + error.message);
                }
            });

            renderCalendar();
            const firstTimeChip = document.querySelector('.time-chip');
            if (firstTimeChip) firstTimeChip.classList.add('selected-time');
        }


})();
