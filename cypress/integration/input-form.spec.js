describe('Input form', () => {
    beforeEach(() => {
        cy.visit('/'); // '/' is filled in from cypress.json "baseUrl"
    });

    it('focuses input on load', () => {
        cy.focused()
            .should('have.class', 'new-todo');
    })

    it('accepts input', () => {
        const typedText = 'Buy Milk';

        cy.get('.new-todo')
            .type(typedText)
            .should('have.value', typedText);
    })

    context('Form submission', () => {
        const typedText = 'Buy eggs';
        it('Adds a new todo on submit', () => {
            cy.server();
            cy.route('POST', '/api/todos', {
                name: typedText,
                id: 1,
                isComplete: false
            })
            cy.get('.new-todo')
                .type(typedText)
                .type('{enter}')
                .should('have.value', '')
            cy.get('.todo-list li')
                .should('have.length', 1)
                .and('contain', typedText)
        })

        it.only('Shows an error message on a failed submission', () => {
            cy.server();
            cy.route({
                url: '/api/todos',
                method: 'POST',
                status: 500,
                response: {}
            })

            cy.get('.new-todo')
                .type('test{enter}')

            cy.get('.todo-list li')
                .should('not.exist')

            cy.get('.error')
                .should('be.visible')
        })
    });
})