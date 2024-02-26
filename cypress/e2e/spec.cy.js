describe('logs into the website using both user and admin accounts and tests all their functionality', () => {
  
  // it('should test the password reset functionality', () => {
  //   cy.visit('localhost:3000')

  //   cy.get('a[class="mb-4 password-reset"]').click()
  //   expect(cy.get('div[class="card text-center reset-password"]')).to.exist
  //   cy.get('input[id="typeEmail"]').type('davanjit@hotmail.com').should('have.value', 'davanjit@hotmail.com')
  //   cy.get('a[class="btn btn-primary w-100"]').click()
  // })

  it('should show the face scanner', () => {
    cy.visit('localhost:3000')

    cy.get('button[class="btn btn-danger"]').click()
    expect(cy.get('div[class="image-area"]')).to.exist
  })

  it('should create a new user, then delete the newly created user', () => {
    cy.visit('localhost:3000')

    cy.get('a[href="/register"]').click()
    cy.url().should('include', '/register')

    cy.get('input[id="first_name"]').type("John").should('have.value', 'John')
    cy.get('input[id="last_name"]').type("Doe").should('have.value', 'Doe')
    cy.get('input[id="email"]').type("John@madeupemail.com").should('have.value', 'John@madeupemail.com')
    cy.get('input[id="password"]').type("1").should('have.value', '1')
    cy.get('input[id="repeat_password"]').type("1").should('have.value', '1')
    cy.get('input[value="Register"]').click()

    cy.get('button[class="btn btn-primary btn-rounded btn-lg"]').click() //clocks in
    
    cy.contains('p', 'Employee Number').prev().invoke('text').then((text) => {
      const employee_number = text.replace('#', '')

      cy.get('button[class="btn btn-danger btn-rounded btn-lg"]').click() //clocks out
      cy.url().should('include', '/login')
  
      cy.get('input[id="employee_number"]').type('wfc').should('have.value', 'wfc')
      cy.get('input[id="password"]').type('12345').should('have.value', '12345')
      cy.get('input[value="Login"]').click()
      cy.url().should('include', '/admin')
  
      cy.get('a[href="/employees"]').click()
      cy.url().should('include', '/employees')
  
      cy.contains('div[class="display-item"]', employee_number).should('exist')
      cy.contains('div', employee_number).find('button').click() //deletes the user
    })
  })

  it('should log in to the website as a regular user', () => {
    cy.visit('localhost:3000')

    cy.get('input[id="employee_number"]').type('404').should('have.value', '404')
    cy.get('input[id="password"]').type('1').should('have.value', '1')
    cy.get('input[value="Login"]').click()

    cy.contains('button', 'Admin').should('not.exist')
  })
  
  it('should log in to the website as a supervisor user', () => {
    cy.visit('localhost:3000')

    cy.get('input[id="employee_number"]').type('333').should('have.value', '333')
    cy.get('input[id="password"]').type('11111').should('have.value', '11111')
    cy.get('input[value="Login"]').click()

    cy.get('button:contains("Clock In")').then($btn => {
      if ($btn) {
        $btn.click()
      }

      cy.contains('button', 'Admin').should('exist')
      cy.contains('button', 'Admin').click()
      cy.url().should('include', '/admin')

      cy.get('a[href="/"]').click()

      cy.contains('button', 'Clock Out').click()
    })
  })

})