$(function () {
  /**
   * Loading data on window load
   */
  $(document).ready(function ($) {
    const _user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));

    $('input[type=email]').val(JSON.parse(localStorage.getItem('email')));
    $('#user-name').text(`${_user.firstname} ${_user.lastname}`);
    $('.profile-name').text(`${_user.firstname} ${_user.lastname}`);
    $('#user-role').text(_user.role);

    roleAccess(_user.role);

    getDashboardOverview(token);
    getUsersAccounts(token);
    getSuppliers(token);
    getLocations(token);
    getProducts(token);
    getCustomers(token);
    getTransactions(token);
    getAuditLogs(token);
    getChartData(token);

    /**
     * Fetch details via path parameter
     */
    const user = new URL(location.href).searchParams.get('user');
    const email = new URL(location.href).searchParams.get('email');
    const supplier = new URL(location.href).searchParams.get('supplier');
    const product = new URL(location.href).searchParams.get('product');
    const loc = new URL(location.href).searchParams.get('loc');
    const customer = new URL(location.href).searchParams.get('customer');
    const order = new URL(location.href).searchParams.get('order');
    const orderDetail = new URL(location.href).searchParams.get('order-detail');
    const userOrEmail = user || email;
    const supplierOrEmail = supplier || email;
    const customerOrEmail = customer || email;

    if (userOrEmail) getUserDetail(userOrEmail, token);
    if (supplierOrEmail) getSupplierDetail(supplierOrEmail, token);
    if (loc) getLocationDetail(loc, token);
    if (product) getProductDetail(product, token);
    if (customerOrEmail) getCustomerDetail(customerOrEmail, token);
    if (customer) getCustomerNameAndCarts(customer, token);
    if (order) getOrderDetails(order, token);
    if (orderDetail) getOrderDetail(orderDetail, token);
  });

  /**
   * Login page
   */
  $('#login').click(function (e) {
    e.preventDefault();

    $('#login').css('display', 'none');
    $('.spinner-border').css('display', 'block');
    const email = $('input[type=email]').val();
    const password = $('input[type=password]').val();
    const remember = $('input[type=checkbox]').val();

    $('#emailError').text(!email ? 'Email is required.' : '');
    $('#passwordError').text(!password ? 'Password is required.' : '');

    if (!email || !password) {
      $('#login').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      return;
    }

    const data = {
      email,
      password,
    };

    $.ajax({
      url: '/api/v1/users/login',
      type: 'POST',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json',
      success: (response) => {
        const { user, token } = response.data;
        $('#error-message').css('display', 'none');
        window.location.href = '/dashboard';
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('user', JSON.stringify(user));

        setCookie('username', remember ? email : null, 24);
        $('input[type=email').val('');
        $('input[type=password').val('');
      },
      error: (response, _, error) => {
        $('#login').css('display', 'block');
        $('.spinner-border').css('display', 'none');
        errorResponse(response, error);
      },
    });
  });

  /**
   * Display password as text
   */
  $('input[name=password]').click(function (e) {
    e.preventDefault();

    if ($('input[name=password]').attr('type') == 'text') {
      $('input[name=password]').attr('type', 'password');
    } else {
      $('input[name=password]').attr('type', 'text');
    }
  });

  $('input[name=repeatPassword]').click(function (e) {
    e.preventDefault();

    if ($('input[name=repeatPassword]').attr('type') == 'text') {
      $('input[name=repeatPassword]').attr('type', 'password');
    } else {
      $('input[name=repeatPassword]').attr('type', 'text');
    }
  });

  $('input[name=oldPassword]').click(function (e) {
    e.preventDefault();

    if ($('input[name=oldPassword]').attr('type') == 'text') {
      $('input[name=oldPassword]').attr('type', 'password');
    } else {
      $('input[name=oldPassword]').attr('type', 'text');
    }
  });

  $('input[name=newPassword]').click(function (e) {
    e.preventDefault();

    if ($('input[name=newPassword]').attr('type') == 'text') {
      $('input[name=newPassword]').attr('type', 'password');
    } else {
      $('input[name=newPassword]').attr('type', 'text');
    }
  });

  $('input[name=confirmPassword]').click(function (e) {
    e.preventDefault();

    if ($('input[name=confirmPassword]').attr('type') == 'text') {
      $('input[name=confirmPassword]').attr('type', 'password');
    } else {
      $('input[name=confirmPassword]').attr('type', 'text');
    }
  });

  /**
   * Forgot password reset
   */
  $('#forgot').click(function (e) {
    e.preventDefault();

    const email = $('input[type=email]').val();

    if (!email) {
      $('#emailError').text('Email is required.');
      return;
    } else {
      $('#emailError').text('');
    }

    // set user email for password reset if forgotten
    localStorage.setItem('email', JSON.stringify(email));

    window.location.href = '/reset';
  });

  $('#reset').click(function (e) {
    e.preventDefault();

    $('#reset').css('display', 'none');
    $('.spinner-border').css('display', 'block');
    const email = $('input[name=email]').val();
    const password = $('input[name=password]').val();
    const repeatPassword = $('input[name=repeatPassword]').val();

    $('#passwordError').text(!password ? 'New password is required.' : '');
    $('#repeatPasswordError').text(
      !repeatPassword ? 'Repeat password is required.' : ''
    );

    if (!password || !repeatPassword) {
      $('#reset').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      return;
    }

    if (password !== repeatPassword) {
      $('#error-message').text('Password mismatch');
      $('#error-message').css('display', 'block');
      $('#reset').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      return;
    }

    const data = {
      email,
      password,
      repeatPassword,
    };

    $.ajax({
      url: '/api/v1/users/reset',
      type: 'PUT',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json',
      success: (response) => {
        $('#reset').css('display', 'block');
        $('.spinner-border').css('display', 'none');
        $('#error-message').css('display', 'none');
        $('#success-message').css('display', 'block');
        $('#success-message').html(
          `<span>${response.message}</span> <a href="/"><strong>Login here</strong></a>`
        );
        $('input[name=email]').val('');
        $('input[name=password]').val('');
        $('input[name=repeatPassword]').val('');
        localStorage.removeItem('email');
      },
      error: (response, _, error) => {
        $('#reset').css('display', 'block');
        $('.spinner-border').css('display', 'none');
        errorResponse(response, error);
      },
    });
  });

  /**
   * Create user account
   */
  $('#create-user').click(function (e) {
    e.preventDefault();

    $('#create-user').css('display', 'none');
    $('#user-loading').css('display', 'block');
    const firstname = $('input[name=firstname]').val();
    const middlename = $('input[name=middlename]').val();
    const lastname = $('input[name=lastname]').val();
    const phoneNumber = $('input[name=phoneNumber]').val();
    const email = $('input[name=email]').val();
    const password = $('input[name=password]').val();
    const repeatPassword = $('input[name=repeatPassword]').val();
    const role = $('#role').val();

    $('#firstnameError').text(!firstname ? 'Firstname is required' : '');
    $('#lastnameError').text(!lastname ? 'Lastname is required' : '');
    $('#phoneNumberError').text(!phoneNumber ? 'Phonenumber is required' : '');
    $('#emailError').text(!email ? 'Email is required' : '');
    $('#passwordError').text(!password ? 'Password is required' : '');
    $('#repeatPasswordError').text(
      !repeatPassword ? 'Confirm password is required' : ''
    );

    if (
      !firstname ||
      !lastname ||
      !phoneNumber ||
      !email ||
      !password ||
      !repeatPassword
    ) {
      $('#create-user').css('display', 'block');
      $('#user-loading').css('display', 'none');
      return;
    }

    if (password !== repeatPassword) {
      $('#create-user').css('display', 'block');
      $('#user-loading').css('display', 'none');
      $('#user-success-message').css('display', 'none');
      $('#user-error-message').text('Password mismatch');
      $('#user-error-message').css('display', 'block');
      return;
    }

    const data = {
      firstname,
      lastname,
      phoneNumber,
      email,
      password,
      repeatPassword,
      role,
    };

    if (middlename) data.middlename = middlename;

    $.ajax({
      url: '/api/v1/users/sign-up',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        const { message } = response;
        $('#user-success-message').text(message);
        $('#user-success-message').css('display', 'block');
        $('#user-error-message').css('display', 'none');
        $('input[name=firstname]').val('');
        $('input[name=middlename]').val('');
        $('input[name=lastname]').val('');
        $('input[name=phoneNumber]').val('');
        $('input[name=email]').val('');
        $('input[name=password]').val('');
        $('input[name=repeatPassword]').val('');
        $('#role').val('');

        $('#create-user').css('display', 'block');
        $('#user-loading').css('display', 'none');
      },
      error: (response, _, error) => {
        $('#create-user').css('display', 'block');
        $('#user-loading').css('display', 'none');
        $('#user-success-message').css('display', 'none');
        errorResponse(response, error, '#user-error-message');
      },
    });
  });

  /**
   * Edit user account
   */
  $('#edit-user').click(function (e) {
    e.preventDefault();

    $('#edit-user').css('display', 'none');
    $('#user-loading').css('display', 'block');
    const firstname = $('input[name=edit-firstname]').val();
    const middlename = $('input[name=edit-middlename]').val();
    const lastname = $('input[name=edit-lastname]').val();
    const phoneNumber = $('input[name=edit-phoneNumber]').val();
    const email = $('input[name=edit-email]').val();
    const role = $('#edit-role').val();

    $('#edit-firstnameError').text(!firstname ? 'First name is required' : '');
    $('#edit-lastnameError').text(!lastname ? 'Last name is required' : '');
    $('#edit-phoneNumberError').text(
      !phoneNumber ? 'Phone number is required' : ''
    );
    $('#edit-emailError').text(!email ? 'Email is required' : '');

    if (!firstname || !lastname || !phoneNumber || !email) {
      $('#edit-user').css('display', 'block');
      $('#user-loading').css('display', 'none');
      return;
    }

    const data = {
      firstname,
      lastname,
      email,
      phoneNumber,
    };

    if (middlename) data.middlename = middlename;
    if (role) data.role = role;

    $.ajax({
      url: `/api/v1/users/${email}/edit`,
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        const { message } = response;
        $('#user-success-message').text(message);
        $('#user-success-message').css('display', 'block');
        $('#user-error-message').css('display', 'none');
        $('input[name=edit-firstname]').val('');
        $('input[name=edit-middlename]').val('');
        $('input[name=edit-lastname]').val('');
        $('input[name=edit-phoneNumber]').val('');
        $('input[name=edit-email]').val('');

        $('#edit-user').css('display', 'block');
        $('#user-loading').css('display', 'none');
      },
      error: (response, _, error) => {
        $('#edit-user').css('display', 'block');
        $('#user-loading').css('display', 'none');
        $('#user-success-message').css('display', 'none');
        errorResponse(response, error, '#user-error-message');
      },
    });
  });

  /**
   * Change password
   */
  $('#change-password').click(function (e) {
    e.preventDefault();

    $('#change-password').css('display', 'none');
    $('#change-loading').css('display', 'block');
    const oldPassword = $('input[name=oldPassword]').val();
    const newPassword = $('input[name=newPassword]').val();
    const repeatPassword = $('input[name=confirmPassword]').val();

    $('#oldPasswordError').text(
      !oldPassword ? 'Old password is required.' : ''
    );
    $('#newPasswordError').text(
      !newPassword ? 'New password is required.' : ''
    );
    $('#confirmPasswordError').text(
      !repeatPassword ? 'Confirm password is required.' : ''
    );

    if (!oldPassword || !newPassword || !repeatPassword) {
      $('#change-password').css('display', 'block');
      $('#change-loading').css('display', 'none');
      return;
    }

    if (newPassword !== repeatPassword) {
      $('#change-error-message').text('Password mismatch.');
      $('#change-error-message').css('display', 'block');
      $('#change-password').css('display', 'block');
      $('#change-loading').css('display', 'none');
      return;
    }

    const data = {
      oldPassword,
      newPassword,
      repeatPassword,
    };

    $.ajax({
      url: '/api/v1/users/change-password',
      type: 'PUT',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        const { message } = response;
        $('#change-success-message').text(message);
        $('#change-success-message').css('display', 'block');
        $('#change-error-message').css('display', 'none');
        $('input[name=oldPassword]').val('');
        $('input[name=newPassword]').val('');
        $('input[name=confirmPassword]').val('');

        $('#change-password').css('display', 'block');
        $('#change-loading').css('display', 'none');
      },
      error: (response, _, error) => {
        $('#change-password').css('display', 'block');
        $('#change-loading').css('display', 'none');
        errorResponse(response, error, '#change-error-message');
      },
    });
  });

  /**
   * Change user role
   */
  $('#change-role').click(function (e) {
    e.preventDefault();

    $('#change-role').css('display', 'none');
    $('#role-loading').css('display', 'block');
    const email = $('input[name="role-email"]').val();
    const role = $('#new-role').val();

    $('#roleEmailError').text(!email ? 'Email is required.' : '');
    $('#newRoleError').text(!role ? 'New role is required.' : '');

    if (!email || !role) {
      $('#change-role').css('display', 'block');
      $('#role-loading').css('display', 'none');
      return;
    }

    const data = {
      role,
    };

    $.ajax({
      url: `/api/v1/users/${email}/change-role`,
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        const { message } = response;
        $('#role-success-message').text(message);
        $('#role-success-message').css('display', 'block');
        $('#role-error-message').css('display', 'none');
        $('input[name=role-email]').val('');
        $('#new-role').val('');

        $('#change-role').css('display', 'block');
        $('#role-loading').css('display', 'none');
      },
      error: (response, _, error) => {
        $('#change-role').css('display', 'block');
        $('#role-loading').css('display', 'none');
        errorResponse(response, error, '#role-error-message');
      },
    });
  });

  /**
   * Create supplier
   */
  $('#create-supplier').click(function (e) {
    e.preventDefault();

    $('#create-supplier').css('display', 'none');
    $('#supplier-loading').css('display', 'block');
    const firstname = $('input[name=supplier-firstname]').val();
    const middlename = $('input[name=supplier-middlename]').val();
    const lastname = $('input[name=supplier-lastname]').val();
    const phoneNumber = $('input[name=supplier-phoneNumber]').val();
    const email = $('input[name=supplier-email]').val();
    const address1 = $('textarea[name=supplier-address]').val();
    const address2 = $('textarea[name=supplier-address2]').val();

    $('#supplierFirstnameError').text(
      !firstname ? 'Firstname is required.' : ''
    );
    $('#supplierLastnameError').text(!lastname ? 'Lastname is required.' : '');
    $('#supplierPhoneNumberError').text(
      !phoneNumber ? 'Phone number is required.' : ''
    );
    $('#supplierEmailError').text(!email ? 'Email is required.' : '');
    $('#supplierAddressError').text(!address1 ? 'Address is required.' : '');

    if (!firstname || !lastname || !phoneNumber || !email || !address1) {
      $('#create-supplier').css('display', 'block');
      $('#supplier-loading').css('display', 'none');
      return;
    }

    const data = {
      firstname,
      lastname,
      phoneNumber,
      email,
      address1,
    };

    if (middlename) data.middlename = middlename;
    if (address2) data.address2 = address2;

    $.ajax({
      url: '/api/v1/suppliers/create',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        $('#create-supplier').css('display', 'block');
        $('#supplier-loading').css('display', 'none');

        $('#supplier-success-message').text(response.message);
        $('#supplier-success-message').css('display', 'block');
        $('#supplier-error-message').css('display', 'none');
        $('input[name=supplier-firstname]').val('');
        $('input[name=supplier-middlename]').val('');
        $('input[name=supplier-lastname]').val('');
        $('input[name=supplier-phoneNumber]').val('');
        $('input[name=supplier-email]').val('');
        $('textarea[name=supplier-address]').val('');
        $('textarea[name=supplier-address2]').val('');
      },
      error: (response, _, error) => {
        $('#create-supplier').css('display', 'block');
        $('#supplier-loading').css('display', 'none');
        $('#supplier-success-message').css('display', 'none');
        errorResponse(
          response,
          error,
          '#supplier-error-message',
          '#supplier-success-messsage'
        );
      },
    });
  });

  /**
   * Edit supplier
   */
  $('#edit-supplier').click(function (e) {
    e.preventDefault();

    const id = new URL(location.href).searchParams.get('id');
    const queryEmail = new URL(location.href).searchParams.get('email');

    $('#edit-supplier').css('display', 'none');
    $('#supplier-loading').css('display', 'block');
    const firstname = $('input[name=edit-supplier-firstname]').val();
    const middlename = $('input[name=edit-supplier-middlename]').val();
    const lastname = $('input[name=edit-supplier-lastname]').val();
    const phoneNumber = $('input[name=edit-supplier-phoneNumber]').val();
    const email = $('input[name=edit-supplier-email]').val();
    const address1 = $('textarea[name=edit-supplier-address]').val();
    const address2 = $('textarea[name=edit-supplier-address2]').val();

    $('#edit-supplierFirstnameError').text(
      !firstname ? 'First name is required.' : ''
    );
    $('#edit-supplierLastnameError').text(
      !lastname ? 'Last name is required.' : ''
    );
    $('#edit-supplierPhoneNumberError').text(
      !phoneNumber ? 'Phone number is required.' : ''
    );
    $('#edit-supplierEmailError').text(!email ? 'Email is required.' : '');
    $('#edit-supplierAddressError').text(
      !address1 ? 'Address is required.' : ''
    );

    if (!firstname || !lastname || !phoneNumber || !email || !address1) {
      $('#edit-supplier').css('display', 'block');
      $('#supplier-loading').css('display', 'none');
      return;
    }

    const data = {
      firstname,
      lastname,
      phoneNumber,
      email,
      address1,
    };

    if (middlename) data.middlename = middlename;
    if (address2) data.address2 = address2;

    $.ajax({
      url: `/api/v1/suppliers/${id || queryEmail}/edit`,
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        $('#edit-supplier').css('display', 'block');
        $('#supplier-loading').css('display', 'none');

        $('#edit-supplier-success-message').text(response.message);
        $('#edit-supplier-success-message').css('display', 'block');
        $('#edit-supplier-error-message').css('display', 'none');
        $('input[name=edit-supplier-firstname]').val('');
        $('input[name=edit-supplier-middlename]').val('');
        $('input[name=edit-supplier-lastname]').val('');
        $('input[name=edit-supplier-phoneNumber]').val('');
        $('input[name=edit-supplier-email]').val('');
        $('textarea[name=edit-supplier-address]').val('');
        $('textarea[name=edit-supplier-address2]').val('');
      },
      error: (response, _, error) => {
        $('#edit-supplier').css('display', 'block');
        $('#supplier-loading').css('display', 'none');
        errorResponse(response, error, '#edit-supplier-error-message');
      },
    });
  });

  /**
   * Create location
   */
  $('#create-location').click(function (e) {
    e.preventDefault();

    $('#create-location').css('display', 'none');
    $('#location-loading').css('display', 'block');
    const name = $('input[name=location-name]').val();
    const description = $('textarea[name=location-description]').val();
    const type = $('#location-type').val();

    $('#locationNameError').text(!name ? 'Location name is required.' : '');

    if (!name) {
      $('#create-location').css('display', 'block');
      $('#location-loading').css('display', 'none');
      return;
    }

    const data = {
      name,
    };

    if (description) data.description = description;
    if (type) data.type = type;

    $.ajax({
      url: '/api/v1/locations/create',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        $('#create-location').css('display', 'block');
        $('#location-loading').css('display', 'none');

        $('#location-success-message').text(response.message);
        $('#location-success-message').css('display', 'block');
        $('#location-error-message').css('display', 'none');
        $('input[name=location-name]').val('');
        $('textarea[name=location-description]').val('');
        $('#location-type').val('');
      },
      error: (response, _, error) => {
        $('#create-location').css('display', 'block');
        $('#location-loading').css('display', 'none');
        $('#location-success-message').css('display', 'none');
        errorResponse(response, error, '#location-error-message');
      },
    });
  });

  /**
   * Edit location
   */
  $('#edit-location').click(function (e) {
    e.preventDefault();

    const id = new URL(location.href).searchParams.get('id');

    $('#edit-location').css('display', 'none');
    $('#location-loading').css('display', 'block');
    const name = $('input[name=edit-location-name]').val();
    const description = $('textarea[name=edit-location-description]').val();
    const type = $('#edit-location-type').val();

    $('#edit-locationNameError').text(
      !name ? 'Location name is required.' : ''
    );

    if (!name) {
      $('#edit-location').css('display', 'block');
      $('#location-loading').css('display', 'none');
      return;
    }

    const data = {
      name,
    };

    if (description) data.description = description;
    if (type) data.type = type;

    $.ajax({
      url: `/api/v1/locations/${id}/edit`,
      type: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        $('#edit-location').css('display', 'block');
        $('#location-loading').css('display', 'none');

        $('#edit-location-success-message').text(response.message);
        $('#edit-location-success-message').css('display', 'block');
        $('#edit-location-error-message').css('display', 'none');
        $('input[name=edit-location-name]').val('');
        $('textarea[name=edit-location-description]').val('');
        $('#edit-location-type').val('');
      },
      error: (response, _, error) => {
        $('#edit-location').css('display', 'block');
        $('#location-loading').css('display', 'none');
        errorResponse(response, error, '#edit-location-error-message');
      },
    });
  });

  /**
   * Create product
   */
  $('#create-product').click(function (e) {
    e.preventDefault();

    const supplier = new URL(location.href).searchParams.get('supplier');

    $('#create-product').css('display', 'none');
    $('#product-loading').css('display', 'block');
    const name = $('input[name="product-name"]').val();
    const unitPrice = $('input[name="product-unitPrice"]').val();
    const quantity = $('input[name="product-quantity"]').val();
    const expire = $('input[name="product-expire"]').val();
    const description = $('textarea[name="product-description"]').val();
    const category = $('#product-category').val();

    $('#productNameError').text(!name ? 'Name is required.' : '');
    $('#productUnitPriceError').text(
      !unitPrice ? 'Unit price is required.' : ''
    );
    $('#productQuantityError').text(!quantity ? 'Quantity is required.' : '');
    $('#productCategoryError').text(!category ? 'Category is required.' : '');
    $('#productExpireError').text(!expire ? 'Expire date is required.' : '');

    if (!name || !unitPrice || !quantity || !category || !expire) {
      $('#create-product').css('display', 'block');
      $('#product-loading').css('display', 'none');
      return;
    }

    const data = {
      name,
      unitPrice,
      quantity,
      category,
      expire,
    };

    if (description) data.description = description;

    $.ajax({
      url: `/api/v1/products/${supplier}/create`,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        $('#create-product').css('display', 'block');
        $('#product-loading').css('display', 'none');

        $('#product-success-message').text(response.message);
        $('#product-success-message').css('display', 'block');
        $('#product-error-message').css('display', 'none');
        $('input[name="product-name"]').val('');
        $('input[name="product-unitPrice"]').val('');
        $('input[name="product-quantity"]').val('');
        $('input[name="product-expire"]').val('');
        $('textarea[name="product-description"]').val('');
        $('#product-category"]').val('');
      },
      error: (response, _, error) => {
        $('#create-product').css('display', 'block');
        $('#product-loading').css('display', 'none');
        $('#product-success-message').css('display', 'none');
        errorResponse(response, error, '#product-error-message');
      },
    });
  });

  /**
   * Edit product
   */
  $('#edit-product').click(function (e) {
    e.preventDefault();

    const id = new URL(location.href).searchParams.get('id');

    $('#edit-product').css('display', 'none');
    $('#product-loading').css('display', 'block');
    const name = $('input[name="edit-product-name"]').val();
    const unitPrice = $('input[name="edit-product-unitPrice"]').val();
    const quantity = $('input[name="edit-product-quantity"]').val();
    const description = $('textarea[name="edit-product-description"]').val();
    const category = $('#edit-product-category').val();

    $('#edit-productNameError').text(!name ? 'Name is required.' : '');
    $('#edit-productUnitPriceError').text(
      !unitPrice ? 'Unit price is required.' : ''
    );
    $('#edit-productQuantityError').text(
      !quantity ? 'Quantity is required.' : ''
    );

    if (!name || !unitPrice || !quantity) {
      $('#edit-product').css('display', 'block');
      $('#product-loading').css('display', 'none');
      return;
    }

    const data = {
      name,
      unitPrice,
      quantity,
    };

    if (description) data.description = description;
    if (category) data.category = category;

    $.ajax({
      url: `/api/v1/products/${id}/edit`,
      type: 'PUT',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        $('#edit-product').css('display', 'block');
        $('#product-loading').css('display', 'none');

        $('#edit-product-success-message').text(response.message);
        $('#edit-product-success-message').css('display', 'block');
        $('#edit-product-error-message').css('display', 'none');
        $('input[name="edit-product-name"]').val('');
        $('input[name="edit-product-unitPrice"]').val('');
        $('input[name="edit-product-quantity"]').val('');
        $('textarea[name="edit-product-description"]').val('');
        $('#edit-product-category"]').val('');
      },
      error: (response, _, error) => {
        $('#edit-product').css('display', 'block');
        $('#product-loading').css('display', 'none');
        errorResponse(response, error, '#edit-product-error-message');
      },
    });
  });

  /**
   * Create customer
   */
  $('#create-customer').click(function (e) {
    e.preventDefault();

    $('#create-customer').css('display', 'none');
    $('#customer-loading').css('display', 'block');
    const firstname = $('input[name=customer-firstname]').val();
    const middlename = $('input[name=customer-middlename]').val();
    const lastname = $('input[name=customer-lastname]').val();
    const phoneNumber = $('input[name=customer-phoneNumber]').val();
    const email = $('input[name=customer-email]').val();
    const address1 = $('input[name=customer-address]').val();
    const address2 = $('input[name=customer-address2]').val();

    $('#customerFirstnameError').text(
      !firstname ? 'Firstname is required.' : ''
    );
    $('#customerLastnameError').text(!lastname ? 'Lastname is required.' : '');
    $('#customerPhoneNumberError').text(
      !phoneNumber ? 'Phone number is required.' : ''
    );
    $('#customerEmailError').text(!email ? 'Email is required.' : '');
    $('#customerAddressError').text(!address1 ? 'Address is required.' : '');

    if (!firstname || !lastname || !phoneNumber || !email || !address1) {
      $('#create-customer').css('display', 'block');
      $('#customer-loading').css('display', 'none');
      return;
    }

    const data = {
      firstname,
      lastname,
      phoneNumber,
      email,
      address1,
    };

    if (middlename) data.middlename = middlename;
    if (address2) data.address2 = address2;

    $.ajax({
      url: '/api/v1/customers/create',
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        const { message, data } = response;
        window.location.href = `cart?customer=${data._id}`;
        $('#create-customer').css('display', 'block');
        $('#customer-loading').css('display', 'none');

        $('#customer-success-message').text(message);
        $('#customer-success-message').css('display', 'block');
        $('#customer-error-message').css('display', 'none');
        $('input[name=customer-firstname]').val('');
        $('input[name=customer-middlename]').val('');
        $('input[name=customer-lastname]').val('');
        $('input[name=customer-phoneNumber]').val('');
        $('input[name=customer-email]').val('');
        $('input[name=customer-address]').val('');
        $('input[name=customer-address2]').val('');
      },
      error: (response, _, error) => {
        $('#create-customer').css('display', 'block');
        $('#customer-loading').css('display', 'none');
        $('#customer-success-message').css('display', 'none');
        errorResponse(response, error, '#customer-error-message');
      },
    });
  });

  /**
   * Edit customer
   */
  $('#edit-customer').click(function (e) {
    e.preventDefault();

    const id = new URL(location.href).searchParams.get('id');

    $('#edit-customer').css('display', 'none');
    $('#customer-loading').css('display', 'block');
    const firstname = $('input[name=edit-customer-firstname]').val();
    const middlename = $('input[name=edit-customer-middlename]').val();
    const lastname = $('input[name=edit-customer-lastname]').val();
    const phoneNumber = $('input[name=edit-customer-phoneNumber]').val();
    const email = $('input[name=edit-customer-email]').val();
    const address1 = $('input[name=edit-customer-address]').val();
    const address2 = $('input[name=edit-customer-address2]').val();

    $('#edit-customerFirstnameError').text(
      !firstname ? 'Firstname is required.' : ''
    );
    $('#edit-customerLastnameError').text(
      !lastname ? 'Lastname is required.' : ''
    );
    $('#edit-customerPhoneNumberError').text(
      !phoneNumber ? 'Phone number is required.' : ''
    );
    $('#edit-customerEmailError').text(!email ? 'Email is required.' : '');
    $('#edit-customerAddressError').text(
      !address1 ? 'Address is required.' : ''
    );

    if (!firstname || !lastname || !phoneNumber || !email || !address1) {
      $('#edit-customer').css('display', 'block');
      $('#customer-loading').css('display', 'none');
      return;
    }

    const data = {
      firstname,
      lastname,
      phoneNumber,
      email,
      address1,
    };

    if (middlename) data.middlename = middlename;
    if (address2) data.address2 = address2;

    $.ajax({
      url: `/api/v1/customers/${id}/edit`,
      type: 'PuT',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        $('#edit-customer').css('display', 'block');
        $('#customer-loading').css('display', 'none');

        $('#edit-customer-success-message').text(response.message);
        $('#edit-customer-success-message').css('display', 'block');
        $('#edit-customer-error-message').css('display', 'none');
        $('input[name=edit-customer-firstname]').val('');
        $('input[name=edit-customer-middlename]').val('');
        $('input[name=edit-customer-lastname]').val('');
        $('input[name=edit-customer-phoneNumber]').val('');
        $('input[name=edit-customer-email]').val('');
        $('input[name=edit-customer-address]').val('');
        $('input[name=edit-customer-address2]').val('');
      },
      error: (response, _, error) => {
        $('#edit-customer').css('display', 'block');
        $('#customer-loading').css('display', 'none');
        errorResponse(response, error, '#edit-customer-error-message');
      },
    });
  });

  /**
   *  Product selection
   */
  $('#select-product').change(function (e) {
    e.preventDefault();

    const product = $('#select-product').val();
    $('#add-to-cart').attr('disabled', true);

    $.ajax({
      url: `/api/v1/products/${product}`,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        const { data } = response;
        $('input[name=cart-unitPrice]').val(data.unitPrice);
        $('input[name=cart-quantity]').val(1);
        $('input[name=cart-description]').val(data.description);
        $('#add-to-cart').attr('disabled', false);
      },
      error: (response, _, error) => {
        $('#add-to-cart').attr('disabled', false);
        errorResponse(response, error, '#cart-error-message');
      },
    });
  });

  /**
   * Add to cart
   */
  $('#add-to-cart').click(function (e) {
    e.preventDefault();

    const customer = new URL(location.href).searchParams.get('customer');
    const token = JSON.parse(localStorage.getItem('token'));

    $('#add-to-cart').css('display', 'none');
    $('#add-loading').css('display', 'block');
    const product = $('#select-product').val();
    const unitPrice = $('input[name=cart-unitPrice]').val();
    const quantity = $('input[name=cart-quantity]').val();
    const description = $('textarea[name=cart-description]').val();

    $('#cartProductError').text(!product ? 'Product is required.' : '');
    $('#cartUnitPriceError').text(!unitPrice ? 'Unit price is required.' : '');
    $('#cartQuantityError').text(!quantity ? 'Quantity is required.' : '');

    if (!product || !unitPrice || !quantity) {
      $('#add-to-cart').css('display', 'block');
      $('#add-loading').css('display', 'none');
      return;
    }

    const data = {
      product,
      unitPrice,
      quantity,
    };

    if (description) data.description = description;

    $.ajax({
      url: `/api/v1/carts/${customer}/create`,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: (response) => {
        $('#add-to-cart').css('display', 'block');
        $('#add-loading').css('display', 'none');
        // getCarts(customer, token);
        window.location.href = `/cart?customer=${customer}`;
        $('#cart-success-message').text(response.message);
        $('#cart-success-message').css('display', 'block');
        $('#cart-error-message').css('display', 'none');
        $('#select-product').text('');
        $('input[name=cart-unitPrice]').val('');
        $('input[name=cart-quantity]').val('');
        $('input[name=cart-description]').val('');
      },
      error: (response, _, error) => {
        $('#add-to-cart').css('display', 'block');
        $('#add-loading').css('display', 'none');
        errorResponse(response, error, '#cart-error-message');
      },
    });
  });

  /**
   * Place order
   */
  $('#grandTotal').click(function (e) {
    e.preventDefault();

    $('#grandTotal').addClass('btn-success');
    $('#grandTotal').css('display', 'none');
    $('#payment-loading').css('display', 'block');
    const customer = new URL(location.href).searchParams.get('customer');
    const amount = $('input[name=grandTotal]').val();

    if (!customer || amount <= 0) {
      $('#grandTotal').css('display', 'block');
      $('#grandTotal').removeClass('btn-success');
      $('#payment-loading').css('display', 'none');
      return;
    }

    const data = { amount: Number(amount) };

    $.ajax({
      url: `/api/v1/orders/${customer}/create`,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        const { data: order } = response;
        $('#grandTotal').removeClass('btn-success');
        $('#order-error-message').css('display', 'none');
        window.location.href = `checkout?order=${order._id}`;
      },
      error: (response, _, error) => {
        $('#grandTotal').css('display', 'block');
        $('#payment-loading').css('display', 'none');
        errorResponse(response, error, '#order-error-message');
      },
    });
  });

  /**
   * Confirm payment
   */
  $('#confirm-payment').click(function (e) {
    e.preventDefault();

    $('#confirm-payment').css('display', 'none');
    $('#confirm-loading').css('display', 'block');
    const order = new URL(location.href).searchParams.get('order');
    const mode = $('#payment-mode').val();

    $('#paymentError').text(!mode ? 'Payment mode is required.' : '');

    if (!mode) {
      $('#confirm-payment').css('display', 'block');
      $('#confirm-loading').css('display', 'none');
      return;
    }

    $.ajax({
      url: `/api/v1/transactions/${order}/create`,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({ mode }),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        const { message } = response;
        $('#confirm-payment').text('Confirm payment');
        $('#payment-success-message').text(message);
        $('#payment-success-message').css('display', 'block');
        $('#payment-error-message').css('display', 'none');
        $('#payment-mode').val('');

        $('#confirm-payment').css('display', 'block');
        $('#confirm-loading').css('display', 'none');
      },
      error: (response, _, error) => {
        $('#confirm-payment').css('display', 'block');
        $('#confirm-loading').css('display', 'none');
        $('#payment-success-message').css('display', 'none');
        errorResponse(response, error);
      },
    });
  });

  /**
   * Create product to be stocked
   */
  $('#stock-product').click(function (e) {
    e.preventDefault();

    $('#stock-product').css('display', 'none');
    $('#stock-loading').css('display', 'block');

    const product = new URL(location.href).searchParams.get('product');
    const name = $('input[name=stock-name]').val();
    const unitPrice = $('input[name=stock-unitPrice]').val();
    const quantity = $('input[name=stock-quantity]').val();
    const expire = $('input[name=stock-expire]').val();
    const description = $('textarea[name=stock-description]').val();
    const category = $('#stock-category').val();

    $('#stockNameError').text(!name ? 'Product name is required' : '');
    $('#stockUnitPriceError').text(!unitPrice ? 'Unit price is required' : '');
    $('#stockQuantityError').text(!quantity ? 'Quantity is required' : '');
    $('#stockExpireError').text(!expire ? 'Expire date is required' : '');
    $('#stockCategoryError').text(!category ? 'Category is required' : '');

    if (!name || !unitPrice || !quantity || !expire || !category) {
      $('#stock-product').css('display', 'block');
      $('#stock-loading').css('display', 'none');
      return;
    }

    const data = {
      name,
      unitPrice,
      quantity,
      expire,
      category,
    };

    if (description) data.description = description;

    $.ajax({
      url: `/api/v1/stocks/${product}/create`,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      success: (response) => {
        $('#stock-product').css('display', 'block');
        $('#stock-loading').css('display', 'none');
        $('#stock-success-message').css('display', 'block');
        $('#stock-success-message').text(response.message);
        $('#stock-error-message').css('display', 'none');
        $('input[name=stock-name]').val('');
        $('input[name=stock-unitPrice]').val('');
        $('input[name=stock-quantity]').val('');
        $('input[name=stock-expire]').val('');
        $('input[name=stock-description]').val('');
        $('#stock-category').val('');
      },
      error: (response, _, error) => {
        $('#stock-product').css('display', 'block');
        $('#stock-loading').css('display', 'none');
        $('#stock-success-message').css('display', 'none');
        errorResponse(response, error, '#stock-error-message');
      },
    });
  });

  /**
   *Logout
   */
  $('#logout').click((e) => {
    logout(e);
  });

  $('#_logout').click((e) => {
    logout(e);
  });
});

function getDashboardOverview(token) {
  $('#loading').css('display', 'none');
  $('.spinner-border').css('display', 'block');

  $.ajax({
    url: '/api/v1/transactions/dashboard/overview',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    success: (response) => {
      const { data } = response;

      $('#suppliers-count').text(data.counts.suppliers);
      $('#products-count').text(data.counts.products);
      $('#locations-count').text(data.counts.locations);
      $('#orders-count').text(data.counts.orders);

      $('#today-orders').text(`GHS ${data.revenues.todayRevenues.toFixed(2)}`);
      $('#today-trend').text(`GHS ${data.trends.today.difference.toFixed(2)}`);
      $('#today-trend').addClass(
        data.revenues.todayRevenues > 0 ? 'visible' : 'invisible'
      );
      $('#today-trend').addClass(
        data.trends.today.trend === 'upward' ? 'text-success' : 'text-danger'
      );

      $('#month-orders').text(
        `GHS ${data.revenues.thisMonthRevenues.toFixed(2)}`
      );
      $('#month-trend').text(`${data.trends.month.difference.toFixed(2)}`);
      $('#month-trend').addClass(
        data.revenues.thisMonthRevenues > 0 ? 'visible' : 'invisible'
      );
      $('#month-trend').addClass(
        data.trends.month.trend === 'upward' ? 'text-success' : 'text-danger'
      );

      $('#quarter-orders').text(
        `GHS ${data.revenues.thisQuarterRevenues.toFixed(2)}`
      );
      $('#quarter-trend').text(`${data.trends.quarter.difference.toFixed(2)}`);
      $('#quarter-trend').addClass(
        data.revenues.thisQuarterRevenues > 0 ? 'visible' : 'invisible'
      );
      $('#quarter-trend').addClass(
        data.trends.quarter.trend === 'upward' ? 'text-success' : 'text-danger'
      );

      $('#bi-year').text(`${data.revenues.thisBiYearRevenues.toFixed(2)}`);
      $('#bi-year-visible').addClass(
        data.revenues.thisBiYearRevenues > 0 ? 'visible' : 'invisible'
      );

      if (data.counts.orders > 0) {
        getProductHistory(token);
        $('#toggle-product-history').css('display', 'block');
      }

      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
    },
    error: (response, _, error) => {
      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      errorResponse(response, error);
    },
  });
}

function getProductHistory(token) {
  $('#product-history').DataTable({
    ajax: {
      url: '/api/v1/order-details/product/history',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      {
        data: 'product',
        render: (data) => {
          const [product, supplier] = data.split('-');

          return `
          <div class="d-flex align-items-center">
            <img
              src="images/favicon.png"
              alt="image"
            />
            <div class="table-user-name ml-3">
              <p class="mb-0 font-weight-medium"> ${product} </p>
              <small>${supplier}</small>
            </div>
          </div>
        `;
        },
      },
      { data: 'unitPrice' },
      { data: 'quantity' },
      { data: 'sold' },
      {
        data: 'difference',
        render: (data) => {
          let less = '';
          if (Number(data) <= 10) {
            less = `<span class="text-danger">${data}</span>`;
          } else {
            less = data;
          }

          return less;
        },
      },
      {
        data: 'expire',
        render: (data) => {
          let expired = '';
          switch (data) {
            case 'Expired':
              expired = `<span class="text-danger">${data}</span>`;
              break;

            default:
              expired = `<span class="text-success">${data}</span>`;
              break;
          }
          return expired;
        },
      },
    ],
    processing: true,
  });
}

function getUsersAccounts(token) {
  $('#users').DataTable({
    ajax: {
      url: '/api/v1/users/list',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'firstname' },
      {
        data: 'middlename',
        render: (data) => {
          if (data == null || data == '') return 'No middle name';

          return data;
        },
      },
      { data: 'lastname' },
      { data: 'phonenumber' },
      {
        data: 'email',
        render: (data) => {
          return `<a href="/edit?email=${data}">${data}</a>`;
        },
      },
      {
        data: 'role',
        render: (data) => {
          let color = '';

          switch (data) {
            case 'superadmin':
              color = 'badge badge-inverse-success';
              break;
            case 'admin':
              color = 'badge badge-inverse-primary';
              break;

            default:
              color = 'badge badge-inverse-warning';
              break;
          }
          const format = data.charAt(0).toUpperCase() + data.slice(1);
          return `<span class="${color}">${format}</span>`;
        },
      },
      {
        data: 'id',
        render: (data) => {
          return `
        <span class="d-inline-block">
          <span class="d-flex d-inline-block">
            <a href="user"><i class="mdi mdi-account-key"></i></a
            >&nbsp;&nbsp;&nbsp;
            <a href="edit?user=${data}"><i class="mdi mdi-pencil"></i></a
            >&nbsp;&nbsp;&nbsp;
          </span>
        </span>
        `;
        },
      },
    ],
    processing: true,
  });
}

function getSuppliers(token) {
  $('#suppliers').DataTable({
    ajax: {
      url: '/api/v1/suppliers/list',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'firstname' },
      {
        data: 'middlename',
        render: (data) => {
          if (data == null || data == '') return 'No middle name';

          return data;
        },
      },
      { data: 'lastname' },
      { data: 'phonenumber' },
      {
        data: 'email',
        render: (data) => {
          return `<a href="/edit-supplier?email=${data}">${data}</a>`;
        },
      },
      {
        data: 'address',
      },
      {
        data: 'id',
        render: (data) => {
          return `
        <span class="d-inline-block">
          <span class="d-flex d-inline-block">
            <a href="product?supplier=${data}"><i class="mdi mdi-basket"></i></a
            >&nbsp;&nbsp;&nbsp;
            <a href="edit-supplier?supplier=${data}"><i class="mdi mdi-pencil"></i></a
            >&nbsp;&nbsp;&nbsp;
          </span>
        </span>
        `;
        },
      },
    ],
    processing: true,
  });
}

function getLocations(token) {
  $('#locations').DataTable({
    ajax: {
      url: '/api/v1/locations/list',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'name' },
      {
        data: 'description',
        render: (data) => {
          if (data == null || data == '') return 'No description';

          return data;
        },
      },
      {
        data: 'type',
        render: (data) => {
          let type = '';
          switch (data) {
            case 'shelves':
              type = `<span class="badge badge-inverse-success">${data}</span>`;
              break;

            default:
              type = `<span class="badge badge-inverse-primary">${data}</span>`;
              break;
          }
          return type;
        },
      },
      {
        data: 'id',
        render: (data) => {
          return `
        <span class="d-inline-block">
          <span class="d-flex d-inline-block">
            <a href="location"><i class="mdi mdi-map"></i></a
            >&nbsp;&nbsp;&nbsp;
            <a href="edit-location?loc=${data}"><i class="mdi mdi-pencil"></i></a
            >&nbsp;&nbsp;&nbsp;
          </span>
        </span>
        `;
        },
      },
    ],
    processing: true,
  });
}

function getProducts(token) {
  $('#products').DataTable({
    ajax: {
      url: '/api/v1/products/list',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'name' },
      {
        data: 'description',
        render: (data) => {
          if (data == null || data == '') return 'No description';

          return data;
        },
      },
      {
        data: 'category',
        render: (data) => {
          let color = 'green';
          switch (data) {
            case 'capsule':
              color = 'orange';
              break;

            case 'cosmetic':
              color = 'violet';
              break;

            case 'grocery':
              color = 'magenta';
              break;

            case 'syrup':
              color = 'yellow';
              break;

            case 'tablet':
              color = 'pink';
              break;

            default:
              color = 'red';
              break;
          }
          return `<span style="color:${color}">${data}</span>`;
        },
      },
      {
        data: 'unitPrice',
      },
      {
        data: 'quantity',
      },
      {
        data: 'expire',
        render: (data) => {
          let expired = '';
          switch (data) {
            case 'Expired':
              expired = `<span class="text-danger">${data}</span>`;
              break;

            default:
              expired = `<span class="text-success">${data}</span>`;
              break;
          }
          return expired;
        },
      },
      {
        data: 'id',
        render: (data) => {
          return `
        <span class="d-inline-block">
          <span class="d-flex d-inline-block">
            <a href="customer"><i class="mdi mdi-cart"></i></a
            >&nbsp;&nbsp;&nbsp;
            <a href="edit-product?product=${data}"><i class="mdi mdi-pencil"></i></a
            >&nbsp;&nbsp;&nbsp;
            <a href="stock?product=${data}"><i class="mdi mdi-reload"></i></a
            >&nbsp;&nbsp;&nbsp;
          </span>
        </span>
        `;
        },
      },
    ],
    processing: true,
  });
}

function getCustomers(token) {
  $('#customers').DataTable({
    ajax: {
      url: '/api/v1/customers/list',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'firstname' },
      {
        data: 'middlename',
        render: (data) => {
          if (data == null || data == '') return 'No middle name';

          return data;
        },
      },
      { data: 'lastname' },
      { data: 'phonenumber' },
      {
        data: 'email',
        render: (data) => {
          return `<a href="/edit-customer?email=${data}">${data}</a>`;
        },
      },
      {
        data: 'address',
      },
      {
        data: 'id',
        render: (data) => {
          return `
        <span class="d-inline-block">
          <span class="d-flex d-inline-block">
            <a href="cart?customer=${data}"><i class="mdi mdi-cart"></i></a
            >&nbsp;&nbsp;&nbsp;
            <a href="edit-customer?customer=${data}"><i class="mdi mdi-pencil"></i></a
            >&nbsp;&nbsp;&nbsp;
          </span>
        </span>
        `;
        },
      },
    ],
    processing: true,
  });
}

function getTransactions(token) {
  $('#transactions').DataTable({
    ajax: {
      url: '/api/v1/transactions/list',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'customer' },
      { data: 'amount' },
      {
        data: 'status',
        render: (data) => {
          let status = '';
          switch (data) {
            case 'pending':
              status = `<span class="badge badge-inverse-warning">${data}</span>`;
              break;
            case 'completed':
              status = `<span class="badge badge-inverse-success">${data}</span>`;
              break;

            default:
              status = `<span class="badge badge-inverse-danger">${data}</span>`;
              break;
          }
          return status;
        },
      },
      { data: 'completion' },
      {
        data: 'order',
        render: (data) => {
          return `
        <span class="d-inline-block">
          <span class="d-flex d-inline-block">
            <a href="orders?order=${data}"><i class="mdi mdi-information"></i></a>
          </span>
        </span>
        `;
        },
      },
    ],
    processing: true,
  });
}

function getOrderDetails(order, token) {
  $('#orders').DataTable({
    ajax: {
      url: `/api/v1/order-details/${order}/list`,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'customer' },
      { data: 'product' },
      { data: 'unitPrice' },
      { data: 'quantity' },
      {
        data: 'description',
        render: (data) => {
          if (data == null || data == '') return 'No description';

          return data;
        },
      },
      {
        data: 'orderDetail',
        render: (data) => {
          return `
        <span class="d-inline-block">
          <span class="d-flex d-inline-block">
            <a href="detail?order-detail=${data}"><i class="mdi mdi-information"></i></a>
          </span>
        </span>
        `;
        },
      },
    ],
    processing: true,
  });
}

function getAuditLogs(token) {
  $('#audits').DataTable({
    ajax: {
      url: '/api/v1/auditlogs/list',
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'firstname' },
      { data: 'lastname' },
      { data: 'phonenumber' },
      { data: 'email' },
      {
        data: 'role',
        render: (data) => {
          let status = '';
          switch (data) {
            case 'admin':
              status = `<span class="badge badge-inverse-primary">${data}</span>`;
              break;
            case 'superadmin':
              status = `<span class="badge badge-inverse-success">${data}</span>`;
              break;

            default:
              status = `<span class="badge badge-inverse-danger">${data}</span>`;
              break;
          }
          return status;
        },
      },
      { data: 'message' },
    ],
    processing: true,
  });
}

function getUserDetail(userOrEmail, token) {
  $('#loading').css('display', 'none');
  $('.spinner-border').css('display', 'block');

  $.ajax({
    url: idOrEmail ? `/api/v1/users/me?u=${userOrEmail}` : '/api/v1/users/me',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (response) => {
      const { data } = response;
      $('input[name=edit-firstname]').val(data.firstname);
      $('input[name=edit-middlename]').val(data.middlename);
      $('input[name=edit-lastname]').val(data.lastname);
      $('input[name=edit-email]').val(data.email);
      $('input[name=edit-phoneNumber]').val(data.phoneNumber);

      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
    },
    error: (response, _, error) => {
      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      errorResponse(response, error, '#user-error-message');
    },
  });
}

function getSupplierDetail(supplierOrEmail, token) {
  $('#loading').css('display', 'none');
  $('.spinner-border').css('display', 'block');

  $.ajax({
    url: `/api/v1/suppliers/${supplierOrEmail}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (response) => {
      const { data } = response;
      $('input[name=edit-supplier-firstname]').val(data.firstname);
      $('input[name=edit-supplier-middlename]').val(data.middlename);
      $('input[name=edit-supplier-lastname]').val(data.lastname);
      $('input[name=edit-supplier-phoneNumber]').val(data.phoneNumber);
      $('input[name=edit-supplier-email]').val(data.email);
      $('textarea[name=edit-supplier-address]').val(data.address1);
      $('textarea[name=edit-supplier-address2]').val(data.address2);

      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
    },
    error: (response, _, error) => {
      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      errorResponse(response, error, '#edit-supplier-error-message');
    },
  });
}

function getLocationDetail(location, token) {
  console.log(location);
  $('#loading').css('display', 'none');
  $('.spinner-border').css('display', 'block');

  $.ajax({
    url: `/api/v1/locations/${location}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (response) => {
      const { data } = response;
      $('input[name=edit-location-name]').val(data.name);
      $('textarea[name=edit-location-description]').val(data.description);
      $('#edit-location-type').val(data.type);

      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
    },
    error: (response, _, error) => {
      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      errorResponse(response, error, '#edit-location-error-message');
    },
  });
}

function getProductDetail(product, token) {
  $('#loading').css('display', 'none');
  $('.spinner-border').css('display', 'block');

  $.ajax({
    url: `/api/v1/products/${product}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (response) => {
      const { data } = response;
      $('input[name=edit-product-name]').val(data.name);
      $('input[name=edit-product-unitPrice]').val(data.unitPrice);
      $('input[name=edit-product-quantity]').val(data.quantity);
      $('input[name=edit-product-expire]').val(data.expire);
      $('textarea[name=edit-product-description]').val(data.description);
      $('#edit-product-category').val(data.category);

      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
    },
    error: (response, _, error) => {
      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      errorResponse(response, error, '#edit-product-error-message');
    },
  });
}

function getCustomerDetail(customerOrEmail, token) {
  $('#loading').css('display', 'none');
  $('.spinner-border').css('display', 'block');

  $.ajax({
    url: `/api/v1/customers/${customerOrEmail}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (response) => {
      const { data } = response;
      $('input[name=edit-customer-firstname]').val(data.firstname);
      $('input[name=edit-customer-middlename]').val(data.middlename);
      $('input[name=edit-customer-lastname]').val(data.lastname);
      $('input[name=edit-customer-phoneNumber]').val(data.phoneNumber);
      $('input[name=edit-customer-email]').val(data.email);
      $('input[name=edit-customer-address]').val(data.address1);
      $('input[name=edit-customer-address2]').val(data.address2);

      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
    },
    error: (response, _, error) => {
      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      errorResponse(response, error, '#edit-customer-error-message');
    },
  });
}

function getCustomerNameAndCarts(customer, token) {
  getName(customer, token);
  getCarts(customer, token);
  if (customer) getCartTotals(customer, token);
}

function getName(customer, token) {
  $('#loading').css('display', 'none');
  $('.spinner-border').css('display', 'block');

  $.ajax({
    url: `/api/v1/customers/${customer}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (response) => {
      const { data } = response;
      $('#customer-name').text(`${data.firstname} ${data.lastname} carts`);

      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
    },
    error: (response, _, error) => {
      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      errorResponse(response, error, '#cart-error-message');
    },
  });
}

function getCarts(customer, token) {
  $('#customer-carts').DataTable({
    ajax: {
      url: `/api/v1/carts/${customer}`,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    columns: [
      { data: 'customer' },
      { data: 'product' },
      { data: 'unitPrice' },
      { data: 'quantity' },
      { data: 'amount' },
    ],
    processing: true,
  });
}

function getCartTotals(customer, token) {
  $.ajax({
    url: `/api/v1/carts/${customer}/pay`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (response) => {
      const { data } = response;
      if (data > 0) {
        $('#grandTotal').css('display', 'block');
        $('#hide-cart-table').css('display', 'block');
        $('#grandTotal').text(`Payable Amount: ${data.toFixed(2)}`);
        $('input[name=grandTotal]').val(data);
      }
    },
    error: (response, _, error) => {
      errorResponse(response, error, '#order-error-message');
    },
  });
}

function getOrderDetail(orderDetail, token) {
  $('#loading').css('display', 'none');
  $('.spinner-border').css('display', 'block');

  $.ajax({
    url: `/api/v1/order-details/${orderDetail}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    success: (response) => {
      const { data: detail } = response;
      $('#name').text(detail.customerName);
      $('#email').text(detail.customerEmail);
      $('#phonenumber').text(detail.customerPhoneNumber);
      $('#address').text(detail.customerAddress);
      if (detail.customerAddress2) {
        $('#address2-div').css('display', 'block');
        $('#address2').text(detail.customerAddress2);
      }

      $('#product-name').text(detail.productName);
      $('#product-unitPrice').text(detail.productUnitPrice);
      $('#product-quantity').text(detail.productQuantity);
      if (detail.productDescription)
        $('#product-description').text(detail.productDescription);

      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
    },
    error: (response, _, error) => {
      $('#loading').css('display', 'block');
      $('.spinner-border').css('display', 'none');
      errorResponse(response, error);
    },
  });
}

function getChartData(token) {
  $.ajax({
    url: '/api/v1/transactions/dashboard/overview',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${token}` },
    success: (response) => {
      const { data: overview } = response;
      const { suppliers, locations, products, orders } = overview.counts;
      const { todayRevenues, thisMonthRevenues, thisQuarterRevenues } =
        overview.revenues;

      /**
       * Line Chart
       */
      const data = {
        labels: ['suppliers', 'locations', 'products', 'orders'],
        datasets: [
          {
            label: '# of Votes',
            data: [suppliers, locations, products, orders],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            fill: false,
          },
        ],
      };

      const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      };

      if ($('#lineChart').length) {
        var lineChartCanvas = $('#lineChart').get(0).getContext('2d');
        new Chart(lineChartCanvas, {
          type: 'line',
          data: data,
          options: options,
        });
      }

      /**
       * Pie Chart
       */

      var doughnutPieData = {
        datasets: [
          {
            data: [todayRevenues, thisMonthRevenues, thisQuarterRevenues],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ['Today', 'Monthly', 'Quarterly'],
      };
      var doughnutPieOptions = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      };

      if ($('#doughnutChart').length) {
        var doughnutChartCanvas = $('#doughnutChart').get(0).getContext('2d');
        var doughnutChart = new Chart(doughnutChartCanvas, {
          type: 'doughnut',
          data: doughnutPieData,
          options: doughnutPieOptions,
        });
      }
    },
    error: (response, _, error) => {
      console.error(error);
    },
  });
}

function logout(e) {
  e.preventDefault();

  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('email');

  window.location.href = '/';
}

function roleAccess(role) {
  if (role === 'user') {
    $('#dashboard-link').css('display', 'none');
    $('#users-link').css('display', 'none');
    $('#create-link').css('display', 'none');
    $('#role-access').css('display', 'none');
    $('#procurement-link').css('display', 'none');
    $('#transactions-link').css('display', 'none');
    $('#audit-link').css('display', 'none');
    $('#audit-logs').css('display', 'none');
    $('#activity').attr('href', '#');
  }

  if (role !== 'superadmin') $('#dashboard-stats').css('display', 'none');
}

function errorResponse(response, error, errorClass) {
  const fallback = '#error-message';
  if (response.status == 400 || response.status == 401) {
    $(errorClass || fallback).css('display', 'block');
    $(errorClass || fallback).text(response.responseJSON.message);
  }
  if (error) {
    $(errorClass || fallback).css('display', 'block');
    $(errorClass || fallback).text(response.responseJSON.message);
  }

  return;
}
