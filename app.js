// Shopping Tracker App with Tab Interface
class ShoppingTracker {
  constructor() {
    this.data = {
      christmas: [
        {
          id: 1,
          name: "Wireless Headphones",
          url: "https://example.com/headphones",
          personName: "João",
          price: 99.99,
          storeName: "Tech Store",
          imageUrl: "placeholder"
        },
        {
          id: 3,
          name: "Smart Watch",
          url: "https://example.com/watch",
          personName: "Maria",
          price: 249.99,
          storeName: "Electronics Hub",
          imageUrl: "placeholder"
        }
      ],
      clothing: [
        {
          id: 2,
          name: "Winter Jacket",
          url: "https://example.com/jacket",
          personName: "Me",
          price: 129.90,
          storeName: "Fashion Hub",
          imageUrl: "placeholder"
        }
      ]
    };
    this.currentCategory = null;
    this.activeTab = 'christmas';
    this.nextId = 4;
    this.confirmedAction = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.bindTabEvents();
    this.setActiveTab(this.activeTab);
    this.renderProducts();
    this.updateStats();
  }

  bindTabEvents() {
    // Tab button click events
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = button.getAttribute('data-tab');
        this.setActiveTab(tabId);
      });
    });
  }

  setActiveTab(tabId) {
    this.activeTab = tabId;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content panels
    document.querySelectorAll('.tab-content-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    // Use setTimeout to ensure smooth transition
    setTimeout(() => {
      document.getElementById(`${tabId}-panel`).classList.add('active');
    }, 50);
  }

  bindEvents() {
    // Add product buttons
    document.querySelectorAll('.add-product-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentCategory = e.target.getAttribute('data-category');
        this.openModal();
      });
    });

    // Clear all buttons
    document.querySelectorAll('.clear-all-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const category = e.target.getAttribute('data-category');
        this.confirmClearAll(category);
      });
    });

    // Sort selects
    document.querySelectorAll('.sort-select').forEach(select => {
      select.addEventListener('change', (e) => {
        e.stopPropagation();
        const category = e.target.id.replace('-sort', '');
        this.sortProducts(category, e.target.value);
      });
    });

    // Search inputs
    document.querySelectorAll('.search-input').forEach(input => {
      input.addEventListener('input', (e) => {
        e.stopPropagation();
        const category = e.target.id.replace('-search', '');
        this.searchProducts(category, e.target.value);
      });
    });

    // Modal events
    this.bindModalEvents();
  }

  bindModalEvents() {
    const modal = document.getElementById('add-product-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const saveBtn = document.getElementById('save-product-btn');

    // Close modal events - fix event handling
    const closeModal = (e) => {
      e.stopPropagation();
      this.closeModal();
    };

    const closeConfirmModal = (e) => {
      e.stopPropagation();
      this.closeConfirmModal();
    };

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    
    // Only close on backdrop click, not on modal content click
    document.getElementById('modal-backdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.closeModal();
      }
    });

    // Confirmation modal events
    document.getElementById('confirm-cancel').addEventListener('click', closeConfirmModal);
    document.getElementById('confirm-ok').addEventListener('click', (e) => {
      e.stopPropagation();
      this.executeConfirmedAction();
    });

    // Form submission
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.saveProduct();
    });

    // Prevent modal content from closing modal when clicked
    const modalContent = modal.querySelector('.modal-content');
    modalContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const confirmContent = confirmModal.querySelector('.modal-content');
    confirmContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!modal.classList.contains('hidden')) {
          this.closeModal();
        }
        if (!confirmModal.classList.contains('hidden')) {
          this.closeConfirmModal();
        }
      }
    });

    // URL input change for image preview
    document.getElementById('product-url').addEventListener('blur', (e) => {
      if (e.target.value) {
        this.previewImage(e.target.value);
      }
    });
  }

  openModal() {
    const modal = document.getElementById('add-product-modal');
    const title = document.getElementById('modal-title');
    const categoryName = this.currentCategory === 'christmas' ? 'Christmas' : 'Clothing';
    
    title.textContent = `Add ${categoryName} Product`;
    modal.classList.remove('hidden');
    
    // Focus on first input after modal is shown
    setTimeout(() => {
      document.getElementById('product-url').focus();
    }, 100);
  }

  closeModal() {
    const modal = document.getElementById('add-product-modal');
    modal.classList.add('hidden');
    this.resetForm();
  }

  resetForm() {
    const form = document.getElementById('product-form');
    form.reset();
    this.clearFormErrors();
    
    // Reset button state
    const saveBtn = document.getElementById('save-product-btn');
    saveBtn.classList.remove('loading');
  }

  async previewImage(url) {
    // Simple URL validation
    try {
      new URL(url);
    } catch {
      return null;
    }

    // For demo purposes, we'll just validate the URL format
    // In a real app, you'd try to extract metadata or load the image
    console.log('Previewing image for URL:', url);
    return url;
  }

  validateForm() {
    const name = document.getElementById('product-name').value.trim();
    const url = document.getElementById('product-url').value.trim();
    const person = document.getElementById('person-name').value.trim();
    const price = document.getElementById('product-price').value;
    const store = document.getElementById('store-name').value.trim();

    this.clearFormErrors();

    let isValid = true;

    if (!name) {
      this.showFieldError('product-name', 'Product name is required');
      isValid = false;
    }

    if (!url) {
      this.showFieldError('product-url', 'Product URL is required');
      isValid = false;
    } else {
      try {
        new URL(url);
      } catch {
        this.showFieldError('product-url', 'Please enter a valid URL');
        isValid = false;
      }
    }

    if (!person) {
      this.showFieldError('person-name', 'Person name is required');
      isValid = false;
    }

    if (!price || parseFloat(price) <= 0) {
      this.showFieldError('product-price', 'Please enter a valid price');
      isValid = false;
    }

    if (!store) {
      this.showFieldError('store-name', 'Store name is required');
      isValid = false;
    }

    return isValid;
  }

  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('form-error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(field => {
      field.classList.remove('form-error');
    });
    document.querySelectorAll('.error-message').forEach(error => {
      error.remove();
    });
  }

  async saveProduct() {
    if (!this.validateForm()) {
      return;
    }

    const saveBtn = document.getElementById('save-product-btn');
    saveBtn.classList.add('loading');

    try {
      const name = document.getElementById('product-name').value.trim();
      const url = document.getElementById('product-url').value.trim();
      const person = document.getElementById('person-name').value.trim();
      const price = parseFloat(document.getElementById('product-price').value);
      const store = document.getElementById('store-name').value.trim();

      // Try to extract image (simplified approach)
      let imageUrl = 'placeholder';
      try {
        // In a real app, you would make a request to extract metadata
        // For demo, we'll just use the URL if it looks like an image
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          imageUrl = url;
        }
      } catch (error) {
        console.log('Could not extract image, using placeholder');
      }

      const product = {
        id: this.nextId++,
        name,
        url,
        personName: person,
        price,
        storeName: store,
        imageUrl
      };

      this.data[this.currentCategory].push(product);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.renderProducts();
      this.updateStats();
      this.closeModal();

      // Show success feedback
      this.showNotification(`Product added to ${this.currentCategory} shopping!`, 'success');
      
    } catch (error) {
      console.error('Error saving product:', error);
      this.showNotification('Error saving product. Please try again.', 'error');
    } finally {
      saveBtn.classList.remove('loading');
    }
  }

  renderProducts() {
    ['christmas', 'clothing'].forEach(category => {
      this.renderCategoryProducts(category);
    });
  }

  renderCategoryProducts(category) {
    const grid = document.getElementById(`${category}-grid`);
    const empty = document.getElementById(`${category}-empty`);
    const products = this.data[category];

    if (products.length === 0) {
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';
    
    // Clear existing products (except empty state)
    const existingCards = grid.querySelectorAll('.product-card');
    existingCards.forEach(card => card.remove());

    products.forEach(product => {
      const card = this.createProductCard(product, category);
      grid.appendChild(card);
    });
  }

  createProductCard(product, category) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const imageContent = product.imageUrl === 'placeholder' 
      ? `<div class="product-card-placeholder">
           <div class="placeholder-icon">📦</div>
           <div>Product Image</div>
         </div>`
      : `<img src="${product.imageUrl}" alt="${product.name}" class="product-card-image" onerror="this.outerHTML='<div class=\\"product-card-placeholder\\"><div class=\\"placeholder-icon\\">📦</div><div>Image not available</div></div>'">`;

    card.innerHTML = `
      <div class="product-card-actions">
        <button class="delete-product-btn" data-product-id="${product.id}" data-category="${category}" title="Delete product">
          🗑️
        </button>
      </div>
      <div class="product-card-header">
        <h3 class="product-card-title">${this.escapeHtml(product.name)}</h3>
      </div>
      ${imageContent}
      <div class="product-card-body">
        <div class="product-person">For: ${this.escapeHtml(product.personName)}</div>
      </div>
      <div class="product-card-footer">
        <span class="product-price">$${product.price.toFixed(2)}</span>
        <span class="product-store">${this.escapeHtml(product.storeName)}</span>
      </div>
    `;

    // Bind delete button event
    const deleteBtn = card.querySelector('.delete-product-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      const category = e.target.getAttribute('data-category');
      this.deleteProduct(productId, category);
    });

    return card;
  }

  deleteProduct(productId, category) {
    this.confirmAction(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      () => {
        this.data[category] = this.data[category].filter(p => p.id !== productId);
        this.renderProducts();
        this.updateStats();
        this.showNotification('Product deleted successfully', 'success');
      }
    );
  }

  confirmClearAll(category) {
    const categoryName = category === 'christmas' ? 'Christmas' : 'Clothing';
    this.confirmAction(
      `Clear All ${categoryName} Products`,
      `Are you sure you want to delete all ${categoryName.toLowerCase()} products? This action cannot be undone.`,
      () => {
        this.data[category] = [];
        this.renderProducts();
        this.updateStats();
        this.showNotification(`All ${categoryName.toLowerCase()} products cleared`, 'success');
      }
    );
  }

  confirmAction(title, message, action) {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    
    this.confirmedAction = action;
    modal.classList.remove('hidden');
  }

  closeConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
    this.confirmedAction = null;
  }

  executeConfirmedAction() {
    if (this.confirmedAction) {
      this.confirmedAction();
      this.confirmedAction = null;
    }
    this.closeConfirmModal();
  }

  sortProducts(category, sortBy) {
    const products = this.data[category];
    
    products.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'person':
          return a.personName.localeCompare(b.personName);
        case 'store':
          return a.storeName.localeCompare(b.storeName);
        default:
          return 0;
      }
    });
    
    this.renderCategoryProducts(category);
  }

  searchProducts(category, query) {
    const grid = document.getElementById(`${category}-grid`);
    const cards = grid.querySelectorAll('.product-card');
    const empty = document.getElementById(`${category}-empty`);
    let visibleCount = 0;

    // Remove previous search empty state
    const searchEmpty = grid.querySelector('.search-empty');
    if (searchEmpty) {
      searchEmpty.remove();
    }

    if (!query.trim()) {
      // Show all cards if no search query
      cards.forEach(card => {
        card.style.display = 'block';
        visibleCount++;
      });
      return;
    }

    cards.forEach(card => {
      const productId = parseInt(card.dataset.productId);
      const product = this.data[category].find(p => p.id === productId);
      
      if (!product) return;

      const searchText = [
        product.name,
        product.personName,
        product.storeName
      ].join(' ').toLowerCase();

      const matches = searchText.includes(query.toLowerCase());
      
      if (matches) {
        card.style.display = 'block';
        visibleCount++;
        
        // Highlight search terms
        this.highlightSearchTerms(card, query);
      } else {
        card.style.display = 'none';
      }
    });

    // Show search empty state if no results
    if (visibleCount === 0) {
      const searchEmptyState = this.createSearchEmptyState(query);
      grid.appendChild(searchEmptyState);
    }
  }

  createSearchEmptyState(query) {
    const div = document.createElement('div');
    div.className = 'empty-state search-empty';
    div.innerHTML = `
      <div class="empty-icon">🔍</div>
      <h3>No results found</h3>
      <p>No products match "${this.escapeHtml(query)}"</p>
    `;
    return div;
  }

  highlightSearchTerms(card, query) {
    if (!query.trim()) return;

    const textElements = card.querySelectorAll('.product-card-title, .product-person, .product-store');
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

    textElements.forEach(element => {
      const originalText = element.dataset.originalText || element.textContent;
      element.dataset.originalText = originalText;
      
      const highlightedText = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');
      element.innerHTML = highlightedText;
    });
  }

  updateStats() {
    ['christmas', 'clothing'].forEach(category => {
      const products = this.data[category];
      const count = products.length;
      const total = products.reduce((sum, product) => sum + product.price, 0);

      // Update section stats
      document.getElementById(`${category}-count`).textContent = 
        `${count} item${count !== 1 ? 's' : ''}`;
      document.getElementById(`${category}-total`).textContent = 
        `$${total.toFixed(2)}`;

      // Update tab stats
      document.getElementById(`${category}-tab-count`).textContent = 
        `${count} item${count !== 1 ? 's' : ''}`;
      document.getElementById(`${category}-tab-total`).textContent = 
        `$${total.toFixed(2)}`;
    });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">✕</button>
      </div>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-16);
          box-shadow: var(--shadow-lg);
          z-index: 10000;
          transform: translateX(400px);
          transition: transform var(--duration-normal) var(--ease-standard);
          max-width: 400px;
        }
        .notification--success {
          border-left: 4px solid var(--color-success);
        }
        .notification--error {
          border-left: 4px solid var(--color-error);
        }
        .notification--info {
          border-left: 4px solid var(--color-info);
        }
        .notification.show {
          transform: translateX(0);
        }
        .notification-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-12);
        }
        .notification-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          font-size: var(--font-size-lg);
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Show notification
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto remove after 3 seconds
    const autoRemove = setTimeout(() => {
      this.removeNotification(notification);
    }, 3000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      clearTimeout(autoRemove);
      this.removeNotification(notification);
    });
  }

  removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize the app
const app = new ShoppingTracker();