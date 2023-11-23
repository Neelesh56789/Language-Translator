import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Translate from './components/Translate'; // Update with the correct path
import Languages from './Languages'; // Adjust the import path as needed

describe('Translate Component', () => {
  beforeEach(() => {
    render(<Translate />);
  });

  it('renders correctly', () => {
    expect(screen.getByPlaceholderText('Text')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Translate')).toBeInTheDocument();
    expect(screen.getByText('Translate Text')).toBeInTheDocument();
  });

  it('allows text input', () => {
    fireEvent.change(screen.getByPlaceholderText('Text'), { target: { value: 'Hello' } });
    expect(screen.getByPlaceholderText('Text').value).toBe('Hello');
  });

  it('populates language options correctly', () => {
    const selectElements = screen.getAllByRole('combobox');
    expect(selectElements).toHaveLength(2); // Assuming you have two select elements for languages
  
    selectElements.forEach((select, index) => {
      const options = within(select).getAllByRole('option');
      expect(options.length).toBeGreaterThan(0); // Check that there are options
  
      // Optionally, check for a few specific languages
      const exampleLanguages = ['English', 'Spanish', 'French']; // Replace with examples from your Languages.js
      exampleLanguages.forEach(lang => {
        expect(within(select).queryByText(lang)).toBeInTheDocument();
      });
    });
  });
  it('updates language selection', () => {
    render(<Translate />);
    const fromLanguageSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(fromLanguageSelect, { target: { value: 'es-ES' } }); // Changing to Spanish
    expect(fromLanguageSelect.value).toBe('es-ES');
  });
  it('exchanges languages and text correctly', async () => {
    render(<Translate />);
  
    const fromTextArea = await screen.findByPlaceholderText('Text');
    const toTextArea = await screen.findByPlaceholderText('Translate');
    const fromLanguageSelect = screen.getAllByRole('combobox')[0];
    const toLanguageSelect = screen.getAllByRole('combobox')[1];
    const exchangeIcon = screen.getByRole('button', { name: /exchange/i }); // Update with correct identifier
  
    // Set initial values
    fireEvent.change(fromTextArea, { target: { value: 'Hello' } });
    fireEvent.change(fromLanguageSelect, { target: { value: 'en-GB' } });
    fireEvent.change(toLanguageSelect, { target: { value: 'es-ES' } });
  
    // Save initial values for comparison after exchange
    const initialFromText = fromTextArea.value;
    const initialToText = toTextArea.value;
    const initialFromLanguage = fromLanguageSelect.value;
    const initialToLanguage = toLanguageSelect.value;
  
    // Perform the exchange
    fireEvent.click(exchangeIcon);
  
    // Check if the text and languages have been exchanged
    expect(fromTextArea.value).toBe(initialToText);
    expect(toTextArea.value).toBe(initialFromText);
    expect(fromLanguageSelect.value).toBe(initialToLanguage);
    expect(toLanguageSelect.value).toBe(initialFromLanguage);
  });
  
      
  it('copies text to clipboard', () => {
    render(<Translate />);
    const copyIcon = screen.getByTestId('copy-from-icon'); // Update with correct identifier
  
    // Mock clipboard functionality
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  
    fireEvent.click(copyIcon);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello'); // Assuming 'Hello' is the text in the from-text area
  });
  
});

