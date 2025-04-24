import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../app/components/Header';

describe('Header Component', () => {
  it('renders the logo', () => {
    render(<Header />);
    const logo = screen.getByText('AIStudyPlans');
    expect(logo).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders "Launch App" button', () => {
    render(<Header />);
    const launchAppLink = screen.getAllByText('Launch App')[0];
    expect(launchAppLink).toBeInTheDocument();
    expect(launchAppLink.getAttribute('href')).toBe('https://app.aistudyplans.com');
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button');
    
    // Mobile menu should be hidden initially
    expect(screen.queryByRole('navigation', { hidden: true })).not.toBeVisible();
    
    // Click menu button to open mobile menu
    fireEvent.click(menuButton);
    
    // Mobile menu should now be visible
    const mobileMenu = screen.getByRole('navigation', { hidden: true });
    expect(mobileMenu).toBeVisible();
    
    // Click menu button again to close mobile menu
    fireEvent.click(menuButton);
    
    // Mobile menu should be hidden again
    expect(screen.queryByRole('navigation', { hidden: true })).not.toBeVisible();
  });
}); 