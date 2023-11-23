describe('Translation App Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Adjust this URL to your app's URL
  });

  it('should load the main page', () => {
    cy.get('.container').should('exist');
  });

  it('should allow text input in the from-text area', () => {
    const sampleText = 'Hello';
    cy.get('.from-text').type(sampleText).should('have.value', sampleText);
  });

  it('should not allow input in the to-text area', () => {
    cy.get('.to-text').should('be.disabled');
  });

  it('should translate text when translate button is clicked', () => {
    const sampleText = 'Hello';
    // Mocking a response, replace with your actual API response structure
    cy.intercept('GET', 'https://api.mymemory.translated.net/*', {
      body: {
        responseData: {
          translatedText: 'Hola'
        },
        matches: []
      }
    });

    cy.get('.from-text').type(sampleText);
    cy.get('.translate-button').click();
    cy.get('.to-text').should('have.value', 'Hola');
  });
  it('should load language options in dropdowns', () => {
    cy.get('.from-language-select option').should('have.length.at.least', 1);
    cy.get('.to-language-select option').should('have.length.at.least', 1);
  });
  it('should not translate when input is empty', () => {
    cy.get('.from-text').clear();
    cy.get('.translate-button').click();
    cy.get('.to-text').should('have.value', '');
  });
  it('successfully copies text to clipboard', () => {
    const sampleText = 'Hello world';
    cy.get('.from-text').type(sampleText);

    // Listen for the window alert and confirm it has the right message
    cy.on('window:alert', (text) => {
      expect(text).to.contains('The text is copied');
    });

    // Click the copy icon
    cy.get('.from-copy-icon').click();
  });

  it('should clear target text when source text is cleared', () => {
    // Visit the page
    cy.visit('http://localhost:3000'); // Replace with your app's URL
  
    // Enter text
    cy.get('.from-text').type('Hello, world!');
  
    // Clear source text
    cy.get('.from-text').clear();
  
    // Assert that target text is also cleared
    cy.get('.to-text').should('have.value', '');
  });
  it('should exchange source and target languages when exchange icon is clicked', () => {
    cy.get('.from-language-select').invoke('val').as('initialSourceLang');
    cy.get('.to-language-select').invoke('val').as('initialTargetLang');

    // Click the exchange icon
    cy.get('.exchange-icon').click();

    // Capture values after the exchange
    cy.get('.from-language-select').invoke('val').as('newSourceLang');
    cy.get('.to-language-select').invoke('val').as('newTargetLang');

    // Assert that the values are not equal after exchange
    cy.get('@initialSourceLang').then((initialSourceLang) => {
      cy.get('@newTargetLang').should('not.equal', initialSourceLang);
    });
    cy.get('@newSourceLang').should('not.equal', 'initialTargetLang');

    cy.get('@initialTargetLang').then((initialTargetLang) => {
      cy.get('@newSourceLang').should('not.equal', initialTargetLang);
    });

    cy.get('@newTargetLang').should('not.equal', 'initialSourceLang');
  });

  
});
