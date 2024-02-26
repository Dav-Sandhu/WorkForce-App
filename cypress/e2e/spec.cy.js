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

  it('should log in as the admin, update employee information, and create/delete customers and processes', () => {
    cy.visit('localhost:3000')

    cy.get('input[id="employee_number"]').type('wfc').should('have.value', 'wfc')
    cy.get('input[id="password"]').type('12345').should('have.value', '12345')
    cy.get('input[value="Login"]').click()

    cy.url().should('include', '/admin')

    cy.get('a[href="/employees"]').click()
    cy.get('#employee_number').select('333').should('have.value', '333')
    cy.get('input[id="hourly_wage"]').clear().type('14.52').should('have.value', '14.52')
    cy.get('button[class="btn btn-success btn-lg mb-1"]').click()
    cy.get('.swal2-confirm').click()
    cy.get('#employee_number').select('333').should('have.value', '333')
    cy.get('input[id="hourly_wage"]').clear().type('16.55').should('have.value', '16.55')
    cy.get('button[class="btn btn-success btn-lg mb-1"]').click()
    cy.get('.swal2-confirm').click()

    cy.get('a[href="/customers"]').click()
    cy.get('input[id="business_name"]').type('business name').should('have.value', 'business name')
    cy.get('input[id="logo"]').type('my logo').should('have.value', 'my logo')
    cy.get('input[id="contact_name"]').type('contact name').should('have.value', 'contact name')
    cy.get('input[id="contact_email"]').type('contact@email.com').should('have.value', 'contact@email.com')
    cy.get('#currency').select('USD').should('have.value', 'USD')
    cy.get('button[class="btn btn-success btn-lg mb-1"]').click()
    cy.get('.swal2-confirm').click()
    cy.contains('p', 'contact@email.com').should('exist').nextAll().eq(1).click() //deletes the newly created customer
    cy.get('.swal2-confirm').click()

    cy.get('a[href="/processes"]').click()
    cy.get('input[id="process_type"]').type('process type').should('have.value', 'process type')
    cy.get('#billable').check().should('be.checked')
    cy.get('input[id="hourly_rate"]').clear().type('17.33').should('have.value', '17.33')
    cy.get('button[class="btn btn-success btn-lg mb-1"]').click()
    cy.get('.swal2-confirm').click()
    cy.contains('h3', 'process type').closest('.card-header').next().find('button.btn.btn-danger').click()
    cy.get('.swal2-confirm').click()

    cy.get('a[href="/assign"]').click()
    cy.contains('p', '#333').closest('.left-section').next().find('button.btn.btn-dark').click()
    cy.get('button[class="btn btn-success"]').click()

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

      //ensures the supervisor user has proper access to the admin page
      cy.contains('button', 'Admin').should('exist')
      cy.contains('button', 'Admin').click()
      cy.url().should('include', '/admin')

      cy.get('a[href="/"]').click() //returns to the home page

      cy.contains('button', 'Tasks').click() //goes to tasks page
      cy.url().should('include', '/tasks')

      cy.contains('button', 'Join a Job').click()
      cy.url().should('include', '/jobs')

      cy.contains('button', 'Packing').click()
      cy.get('div[class="customer"]').first().click()

      cy.url().should('include', '/working')
      cy.get('button[class="finish-button btn btn-danger"]').first().click()

      cy.get('button[class="user-button btn btn-outline-secondary rounded-pill"]').click()
      cy.url().should('include', '/')

      cy.contains('button', 'Tasks').click() 
      cy.url().should('include', '/tasks')

      cy.contains('button', 'Ask for a Job').click()
      cy.get('.swal2-confirm').click()

      cy.contains('button', 'Take a Break').click()
      cy.url().should('include', '/working')
      cy.get('div[class="work-description"]').first().trigger('mouseover')
      cy.get('button[class="close-button-left btn-close"]').first().click({ force: true })

      cy.get('button[class="user-button btn btn-outline-secondary rounded-pill"]').click()
      cy.url().should('include', '/')
      cy.contains('button', 'Clock Out').click()
    })
  })

})