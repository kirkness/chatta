;window.chatta = (function(config) {

  var noop = function() {};
  var _dom = [];
  var upArrow = '&#9650;';
  var downArrow = '&#9660;';

  // --------------------------------------------------
  // -- Basic date formatting
  // --------------------------------------------------

  Date.prototype.format = function() {
    var dayNames = ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat'];
    var day = dayNames[this.getDay()];
    var hour = this.getHours();
    var minutes = this.getMinutes();
    return hour + ':' + minutes + ' on ' + day;
  };


  // --------------------------------------------------
  // -- Element Object
  // --------------------------------------------------

  function Element(type, id) {
    this._elm = document.createElement(type);
    this._elm.setAttribute('id', id);
    this._id = id;
    this._type = type;
    _dom.push(this);
  }

  // Add styles - obj
  Element.prototype.addStyles = function(styles) {
    for (var prop in styles) {
      this._elm.style[prop] = styles[prop];
    }
  };

  // Append child to element
  Element.prototype.append = function(element) {
    this._elm.appendChild(element.getElement());
    return this;
  };

  // Get the DOM element
  Element.prototype.getElement = function() {
    return this._elm;
  };

  // Set inner text
  Element.prototype.setText = function(text) {
    this._elm.innerHTML = text;
  };

  // Set attribute
  Element.prototype.attr = function(attr, val) {
    this._elm.setAttribute(attr, val);
  };

  // Add event listener
  Element.prototype.on = function(event, cb) {
    this._elm['on' + event] = cb;
  };

  // Is valid email address
  Element.prototype.isValidEmail = function() {
    var email = this.val();
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  };

  // Vertical animation
  Element.prototype.animateY = function(y, cb) {
    var top = parseInt(css(this._elm, 'bottom'), 10),
        dy = top - y, i = 1, count = 20, _this = this;

    function frame() {
      if ( i >= count ) { return (cb||noop)(); }
      i += 1;
      _this._elm.style.bottom = (top - (dy * i / count)).toFixed(0) + 'px';
      setTimeout( frame, 5 );
    } frame();

    function css(element, property) {
      return window.getComputedStyle( element, null ).getPropertyValue( property );
    }
  };

  Element.prototype.val = function(text) {
    if(typeof text !== 'undefined')
      this._elm.value = text;
    return this._elm.value || false;
  };

  // Get element dimensions
  Element.prototype.height = function() {
    var elmHeight, elmMargin, elm = this._elm;
    if(document.all) {
      elmHeight = parseInt(elm.currentStyle.height.replace('px', ''));
      elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(
        elm.currentStyle.marginBottom, 10
      );
    } else {
      elmHeight = parseInt(document.defaultView.getComputedStyle(elm, '')
        .getPropertyValue('height').replace('px', ''));

      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '')
        .getPropertyValue('margin-top')) + parseInt(
          document.defaultView.getComputedStyle(elm, ''
        ).getPropertyValue('margin-bottom'));
    }
    return (elmHeight + elmMargin);
  }

  // Find an element by id
  Element.find = function(id) {
    for (var i = 0; i < _dom.length; i++) {
      if(_dom[i]._id === id) return _dom[i];
    }
  };


  // --------------------------------------------------
  // -- Message element
  // --------------------------------------------------

  function MessageElement(message) {
    this._id = message.id;

    // Create some DOM elements
    this.$chattaMssgWrap    = new Element('div', 'chatta_mssg_'+this._id);
    this.$chattaMssgContent = new Element('div', 'chatta_mssg_content_'+this._id);
    this.$chattaMssgMeta    = new Element('div', 'chatta_mssg_meta_'+this._id);

    // Chat message wrapper styles
    this.$chattaMssgWrap.addStyles({
      'margin': (message.isRight) ? '20px 10px 20px 40px' : '20px 40px 20px 10px',
      'text-align': (message.isRight) ? 'right' : 'left',
      'background':'#fff',
      'margin-bottom':'10px',
      '-webkit-border-radius':'3px',
      '-webkit-border-radius':'3px',
      '-moz-border-radius':'3px',
      '-moz-border-radius':'3px',
      'border-radius':'3px',
      'border-radius':'3px',
    });

    // Chat message content styles
    this.$chattaMssgContent.addStyles({
      'padding':'7px 10px'
    });

    // Chat message meta styles
    this.$chattaMssgMeta.addStyles({
      'border-top':'1px solid #eee',
      'margin':'0px 10px',
      'padding':'5px 0px',
      'font-size':'9px',
      'color':'#ccc'
    });

    this.$chattaMssgContent.setText(message.content);
    this.$chattaMssgMeta.setText('Sent by ' + message.from + ' at ' + message.date.format());

    this.$chattaMssgWrap
      .append(this.$chattaMssgContent)
      .append(this.$chattaMssgMeta);

    return this.$chattaMssgWrap;
  }


  // --------------------------------------------------
  // -- Build the widget
  // --------------------------------------------------

  // Create elements
  var $chattaWrap       = new Element('div', 'chatta_wrap');
  var $chattaTab        = new Element('div', 'chatta_tab');
  var $chattaTabArrow   = new Element('span', 'chatta_tab_arrow');
  var $chattaBox        = new Element('div', 'chatta_box');
  var $chattaFormWrap   = new Element('div', 'chatta_form_wrap');
  var $chattaForm       = new Element('form', 'chatta_form');
  var $chattaEmailField = new Element('input', 'chatta_email_field');
  var $chattaNameField  = new Element('input', 'chatta_name_field');
  var $chattaMessageBox = new Element('textarea', 'chatta_message_box');
  var $chattaSubmit     = new Element('input', 'chatta_submit');
  var $chattaUserDetails= new Element('div', 'chatta_user_details');

  // Set attributes if needed
  $chattaTabArrow.setText(upArrow);
  $chattaTab.setText(config&&config.label||'Chat to the team!');
  $chattaEmailField.attr('type', 'text');
  $chattaEmailField.attr('placeholder', 'Your email');
  $chattaNameField.attr('type', 'text');
  $chattaNameField.attr('placeholder', 'Your name');
  $chattaMessageBox.attr('placeholder', 'Your message');
  $chattaSubmit.attr('type', 'submit');
  $chattaSubmit.attr('value', 'Send');

  // Add styles
  $chattaWrap.addStyles({
    'width':'400px',
    'background':'#fff',
    'position':'fixed',
    'bottom':'-500px',
    'right':'50px',
    'z-index':'9999',
    '-webkit-border-top-left-radius':'3px',
    '-webkit-border-top-right-radius':'3px',
    '-moz-border-radius-topleft':'3px',
    '-moz-border-radius-topright':'3px',
    'border-top-left-radius':'3px',
    'border-top-right-radius':'3px',
    'overflow':'hidden',
    'display':'none',
    '-webkit-box-shadow':'1px 1px 2px 0px rgba(0,0,0,0.3)',
    '-moz-box-shadow':'1px 1px 2px 0px rgba(0,0,0,0.3)',
    'box-shadow':'1px 1px 2px 0px rgba(0,0,0,0.3)'
  });

  $chattaTab.addStyles({
    'padding':'10px 20px',
    'background':'#cd5a54',
    'color':'#fff'
  });

  $chattaTabArrow.addStyles({
    'color':'#fff',
    'float':'right'
  });

  $chattaBox.addStyles({
    'max-height':'150px',
    'overflow':'scroll',
    'font-size':'11px',
    'background':'#eee'
  });

  $chattaFormWrap.addStyles({
    'width':'400px',
    'padding':'10px',
    'bottom':'0px',
    'background':'#fff',
    'left':'0px'
  });

  var chattaInputStyle = {
    'width':'380px',
    'border':'1px solid #eee',
    'background':'#eee',
    'box-shadow':'none',
    '-webkit-border-radius':'3px',
    '-webkit-border-radius':'3px',
    '-moz-border-radius':'3px',
    '-moz-border-radius':'3px',
    'border-radius':'3px',
    'border-radius':'3px',
    'margin-bottom':'7px',
    'padding':'3px'
  };

  $chattaNameField.addStyles(chattaInputStyle);
  $chattaEmailField.addStyles(chattaInputStyle);
  $chattaMessageBox.addStyles(chattaInputStyle);

  $chattaSubmit.addStyles({
    'width':'380px',
    'border':'none',
    '-webkit-border-radius':'3px',
    '-webkit-border-radius':'3px',
    '-moz-border-radius':'3px',
    '-moz-border-radius':'3px',
    'border-radius':'3px',
    'border-radius':'3px',
    'margin-bottom':'7px',
    'background-color':'#3b80c1',
    'color':'#fff',
    'top':'0px'
  });

  $chattaUserDetails.addStyles({
    'text-align':'center',
    'background':'#36c498',
    'color':'#fff',
    'padding':'4px',
    'font-size':'11px',
    'display':'none'
  });

  // Create tree
  $chattaTab.append($chattaTabArrow);
  $chattaWrap.append($chattaTab);
  $chattaWrap.append($chattaBox);
  $chattaForm.append($chattaNameField);
  $chattaForm.append($chattaEmailField);
  $chattaForm.append($chattaMessageBox);
  $chattaForm.append($chattaSubmit);
  $chattaFormWrap.append($chattaForm);
  $chattaWrap.append($chattaFormWrap);
  $chattaWrap.append($chattaUserDetails);



  // --------------------------------------------------
  // -- Chatta window
  // --------------------------------------------------

  var $chatta = { _e: $chattaWrap, _isUp: false };

  $chatta.init = function(callback) {
    var _this = this;

    // Render the widget on DOM
    document.body.appendChild(this._e.getElement());

    // Widget events
    this._events = {
      opened: noop,
      closed: noop,
      formSubmission: noop,
      initialFormSubmission: noop
    };

    // Array of widget messages
    this._messages = [];

    // Chat user
    this._user = null;

    /**
     * Add event listeners to DOM elms
     */

    // Tab clicked - toggle the widget
    $chattaTab.on('click', function() {
      _this.toggleBox();
    });

    // Form sumitted
    function formSubmit(e) {
      _this.resetErrorState();
      var formData = _this._getFormData();
      var success = true;

      // If this is the first message callback
      if(!_this._messages.length)
        success = _this._events.initialFormSubmission(formData);

      // On every form submission callback
      if(success) _this._events.formSubmission(formData);

      // Clear the textarea
      $chattaMessageBox.val('');

      // Prevent form submission
      e.preventDefault();
    }

    // Call submit on submit event and 'enter'
    $chattaForm.on('submit', formSubmit);
    $chattaMessageBox.on('keyup', function(e) {
      e = e || event;
      if (e.keyCode === 13 && !e.ctrlKey)
        return formSubmit(e);
      return true;
    });

    // Make visible, slide up
    this.display();
    this.showTab(true, function() {
      callback(_this);
    });

    return _this;
  };

  // Returns the form data
  $chatta._getFormData = function() {
    var data = {};
    data.message = $chattaMessageBox.val();
    data.user = {
      name: $chattaNameField.val(),
      email: $chattaEmailField.isValidEmail()&&$chattaEmailField.val()
    };
    return data;
  };

  // Slides the widget to only show its tab
  $chatta.showTab = function(animated, callback) {
    var wrapHeight = this._e.height();
    var tabHeight = Element.find('chatta_tab').height();
    if(animated !== false) {
      this._e.animateY(tabHeight-wrapHeight, callback);
    } else {
      this._e.addStyles({
        'bottom': (tabHeight-wrapHeight) + 'px'
      });
    }
    return this;
  };

  // Sets the chat user, highlights in widget foot
  $chatta.setUser = function(user) {
    this._user = user;

    if(this._user.name && this._user.email){
      // Add user details below form
      $chattaUserDetails.setText('Messaging as ' + user.name + ' : ' + user.email);
      $chattaUserDetails.addStyles({
        'display':'block'
      });
      return true;
    }
    return false;
  };

  // Returns user
  $chatta.getUser = function() {
    return this._user;
  };

  // Slide up or down
  $chatta.toggleBox = function(callback) {
    var _this = this;
    if(_this._isUp) {
      this.showTab(true, function() {
        $chattaTabArrow.setText(upArrow);
        _this._isUp = false;
        (callback||noop)();
      });
    } else {
      _this._e.animateY(0, function() {
        _this._isUp = true;
        $chattaTabArrow.setText(downArrow);
        (callback||noop)();
      });
    }
    return _this;
  };

  // Reset the error formetting
  $chatta.resetErrorState = function() {
    // Set error mssg background color/hide
    $chattaUserDetails.addStyles({
      'background':'#36c498',
      'display':'none'
    });

    $chattaEmailField.addStyles({
      'border':'1px solid #eee'
    });

    $chattaNameField.addStyles({
      'border':'1px solid #eee'
    });

    return this;
  };

  // Set error highlighting
  $chatta.setErrors = function(message, nameErr, emailErr) {

    // Set error mssg background color
    $chattaUserDetails.addStyles({
      'background':'#cd5a54'
    });

    // Set message text
    $chattaUserDetails.setText(message || 'Form error');

    // If name error set red border
    if(nameErr)
      $chattaNameField.addStyles({
        'border':'1px solid #cd5a54'
      });

    // If email error set red border
    if(emailErr)
      $chattaEmailField.addStyles({
        'border':'1px solid #cd5a54'
      });

    // Show the user error box
    $chattaUserDetails.addStyles({
      'display':'block'
    });

    return this;
  };

  // Show the widget
  $chatta.display = function() {
    this._e.addStyles({display:'block'});
    return this;
  };

  // Hide the widget
  $chatta.hide = function() {
    this._e.addStyles({display:'none'});
    return this;
  };

  // Validate required message props
  $chatta._validateMessage = function(message) {
    var err = false;
    if(typeof message !== 'object')
      err = true;
    else if(!message.hasOwnProperty('from'))
      err = true;
    else if (!message.hasOwnProperty('content'))
      err = true;
    else if(!message.hasOwnProperty('date'))
      err = true;
    else if(!message.hasOwnProperty('isRight'))
      err = true;
    if(err) console.error('Message is invalid!');
    return err;
  };

  // Scroll to the bottom of the chat box
  $chatta.scrollToBottom = function() {
    $chattaBox.getElement().scrollTop = $chattaBox.getElement().scrollHeight;
  };

  // Hide/show the user fields
  $chatta.hideUserFields = function(hide) {
    $chattaEmailField.addStyles({
      'display':(hide)?'none':'block'
    });
    $chattaNameField.addStyles({
      'display':(hide)?'none':'block'
    });
  };

  // Call 'on' to subscribe to widget events
  $chatta.on = function(event, callback) {
    this._events[event] = callback;
  };


  // Add message element to widget
  $chatta.addMessage = function(message) {

    /// Check for all required fields
    if(this._validateMessage(message))
      return this._presentError();

    // Uid for message element
    message.id = parseInt(1000*Math.random());

    // Create the message element
    var $mssg = new MessageElement(message);

    // Force open the 'Messaging as' box
    this.setUser(this._user);

    // Add the message elm to bottom of box
    $chattaBox.append($mssg);

    // Add the message to local messages
    this._messages.push(message);

    // Make sure that the tab remains down
    if(!this._isUp) this.showTab(false);

    // Scroll to the bottom of the window
    this.scrollToBottom();
  };

  return $chatta;
})();
