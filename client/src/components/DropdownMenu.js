import React, { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({ trigger, children, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-menu-container" ref={menuRef}>
      <button
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile - closes menu when clicked */}
          <div 
            className="dropdown-backdrop"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              zIndex: 999,
              display: 'none'
            }}
          />
          
          <div className={`dropdown-menu ${align}`}>
            <div className="dropdown-menu-content">
              {React.Children.map(children, (child) =>
                React.cloneElement(child, {
                  onClick: () => {
                    if (child.props.onClick) {
                      child.props.onClick();
                    }
                    setIsOpen(false);
                  },
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, disabled = false }) => {
  return (
    <button
      className={`dropdown-menu-item ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const DropdownMenuSeparator = () => {
  return <div className="dropdown-menu-separator" />;
};

const DropdownMenuHeader = ({ children }) => {
  return <div className="dropdown-menu-header">{children}</div>;
};

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuHeader };
