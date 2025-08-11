// DOM Elements
const searchForm = document.getElementById('search-form');
const searchSection = document.getElementById('search-section');
const resultsSection = document.getElementById('results-section');
const invoiceSection = document.getElementById('invoice-section');
const successSection = document.getElementById('success-section');
const showInvoiceBtn = document.getElementById('show-invoice-btn');
const uploadArea = document.getElementById('upload-area');
const receiptUpload = document.getElementById('receipt-upload');
const uploadedFile = document.getElementById('uploaded-file');
const fileName = document.getElementById('file-name');
const removeFileBtn = document.getElementById('remove-file');
const submitPaymentBtn = document.getElementById('submit-payment');
const printInvoiceBtn = document.getElementById('print-invoice');
const newSearchBtn = document.getElementById('new-search');

// Sample student data (in real application, this would come from a database)
const studentData = {
    '1140959790': {
        name: 'نوف بنت محمد بن فرحان التركي',
        qualification: 'بكالوريوس',
        major: 'تمريض - مسار التخصصات الصحية',
        status: 'مقبول',
        applicationNumber: 'TR2024001'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addAnimations();
});

function initializeEventListeners() {
    // Search form submission
    searchForm.addEventListener('submit', handleSearch);
    
    // Show invoice button
    showInvoiceBtn.addEventListener('click', showInvoice);
    
    // File upload functionality
    uploadArea.addEventListener('click', () => receiptUpload.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleFileDrop);
    receiptUpload.addEventListener('change', handleFileSelect);
    removeFileBtn.addEventListener('click', removeFile);
    
    // Payment submission
    submitPaymentBtn.addEventListener('submit', handlePaymentSubmission);
    
    // Print invoice
    printInvoiceBtn.addEventListener('click', printInvoice);
    
    // New search
    newSearchBtn.addEventListener('click', startNewSearch);
}

function handleSearch(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('student-id').value.trim();
    const applicationNumber = document.getElementById('application-number').value.trim();
    
    // Validate input
    if (!studentId || !applicationNumber) {
        showAlert('يرجى إدخال جميع البيانات المطلوبة', 'error');
        return;
    }
    
    // Simulate API call delay
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        // Check if student exists (simplified validation)
        if (studentData[studentId] && studentData[studentId].applicationNumber === applicationNumber) {
            showResults();
        } else {
            showAlert('لم يتم العثور على بيانات مطابقة. يرجى التأكد من صحة البيانات المدخلة', 'error');
        }
    }, 1500);
}

function showResults() {
    hideAllSections();
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('fade-in');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function showInvoice() {
    hideAllSections();
    invoiceSection.classList.remove('hidden');
    invoiceSection.classList.add('slide-in');
    
    // Scroll to invoice
    invoiceSection.scrollIntoView({ behavior: 'smooth' });
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#e8f5e8';
    uploadArea.style.borderColor = '#2c5530';
}

function handleFileDrop(e) {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#f8f9fa';
    uploadArea.style.borderColor = '#4a7c59';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('نوع الملف غير مدعوم. يرجى اختيار صورة أو ملف PDF', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('حجم الملف كبير جداً. يرجى اختيار ملف أصغر من 5 ميجابايت', 'error');
        return;
    }
    
    // Show uploaded file
    fileName.textContent = file.name;
    uploadArea.style.display = 'none';
    uploadedFile.classList.remove('hidden');
    
    // Enable submit button
    submitPaymentBtn.disabled = false;
    submitPaymentBtn.style.opacity = '1';
}

function removeFile() {
    receiptUpload.value = '';
    uploadArea.style.display = 'block';
    uploadedFile.classList.add('hidden');
    
    // Disable submit button
    submitPaymentBtn.disabled = true;
    submitPaymentBtn.style.opacity = '0.6';
}

function handlePaymentSubmission() {
    if (!receiptUpload.files[0]) {
        showAlert('يرجى إرفاق إيصال السداد أولاً', 'error');
        return;
    }
    
    // Simulate submission
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showSuccess();
    }, 2000);
}

function showSuccess() {
    hideAllSections();
    successSection.classList.remove('hidden');
    successSection.classList.add('fade-in');
    
    // Scroll to success message
    successSection.scrollIntoView({ behavior: 'smooth' });
    
    // Show celebration animation
    createConfetti();
}

function printInvoice() {
    // Hide non-printable elements
    const nonPrintable = document.querySelectorAll('.btn, .upload-section');
    nonPrintable.forEach(el => el.style.display = 'none');
    
    // Print
    window.print();
    
    // Restore elements
    setTimeout(() => {
        nonPrintable.forEach(el => el.style.display = '');
    }, 1000);
}

function startNewSearch() {
    // Reset form
    searchForm.reset();
    
    // Reset file upload
    removeFile();
    
    // Show search section
    hideAllSections();
    searchSection.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAllSections() {
    const sections = [searchSection, resultsSection, invoiceSection, successSection];
    sections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('fade-in', 'slide-in');
    });
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; margin-right: 10px;">&times;</button>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f8d7da' : '#d4edda'};
        color: ${type === 'error' ? '#721c24' : '#155724'};
        border: 1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'};
        border-radius: 8px;
        padding: 15px 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 400px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

function showLoading() {
    // Create loading overlay
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>جاري المعالجة...</p>
        </div>
    `;
    
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    const spinnerStyles = `
        .loading-spinner {
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4a7c59;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    // Add styles if not already added
    if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = spinnerStyles;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

function addAnimations() {
    // Add CSS animations
    const animationStyles = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .alert {
            animation: slideInRight 0.3s ease;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = animationStyles;
    document.head.appendChild(style);
}

function createConfetti() {
    // Simple confetti animation
    for (let i = 0; i < 50; i++) {
        createConfettiPiece();
    }
}

function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#4a7c59', '#28a745', '#ffc107', '#17a2b8'][Math.floor(Math.random() * 4)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        z-index: 1000;
        pointer-events: none;
        animation: confettiFall 3s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Add click event listener for submit payment button
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-payment');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handlePaymentSubmission();
        });
    }
});

