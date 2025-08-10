// Accessibility utilities for the onboarding components

export const addAriaLabels = (element: HTMLElement, label: string) => {
  element.setAttribute('aria-label', label);
};

export const addAriaDescribedBy = (element: HTMLElement, describedById: string) => {
  element.setAttribute('aria-describedby', describedById);
};

export const addRole = (element: HTMLElement, role: string) => {
  element.setAttribute('role', role);
};

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  onNext?: () => void,
  onBack?: () => void,
  onSelect?: () => void,
) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      if (onSelect) {
        event.preventDefault();
        onSelect();
      }
      break;
    case 'ArrowRight':
      if (onNext) {
        event.preventDefault();
        onNext();
      }
      break;
    case 'ArrowLeft':
      if (onBack) {
        event.preventDefault();
        onBack();
      }
      break;
  }
};

// Screen reader announcements
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management
export const focusElement = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.focus();
  }
};

export const trapFocus = (containerElement: HTMLElement) => {
  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  containerElement.addEventListener('keydown', handleTabKey);

  return () => {
    containerElement.removeEventListener('keydown', handleTabKey);
  };
};
