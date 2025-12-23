import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuHeader } from './DropdownMenu';

const NavbarMenuDemo = ({ currentLanguage, changeLanguage }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu
      trigger={
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          ☰ Menu
        </span>
      }
      align="right"
    >
      <DropdownMenuHeader>Navigation</DropdownMenuHeader>
      
      <DropdownMenuItem onClick={() => navigate('/')}>
        🏠 Home
      </DropdownMenuItem>

      <DropdownMenuItem 
        onClick={() => navigate('/developer-info')}
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: '600'
        }}
      >
        💻 Developer Info
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/about')}>
        ℹ️ About
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/companies')}>
        🏢 Our Companies
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/our-services')}>
        🛠️ Our Services
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuHeader>Services</DropdownMenuHeader>
      
      <DropdownMenuItem onClick={() => navigate('/manage-farm')}>
        🚜 Manage Farm
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/buy-inputs')}>
        🛒 Buy Inputs
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/sell-produce')}>
        💰 Sell Produce
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/land')}>
        🏞️ Land
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/construction')}>
        🏗️ Construction
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={() => navigate('/projects')}>
        📸 Past Work
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem onClick={() => navigate('/join')}>
        👥 Join Us
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      
      <DropdownMenuItem 
        onClick={() => changeLanguage(currentLanguage === 'en' ? 'ta' : 'en')}
        style={{
          background: 'linear-gradient(135deg, #C9A86A 0%, #B8935A 100%)',
          color: 'white',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        🌐 {currentLanguage === 'en' ? 'Switch to தமிழ்' : 'Switch to English'}
      </DropdownMenuItem>
    </DropdownMenu>
  );
};

export default NavbarMenuDemo;
