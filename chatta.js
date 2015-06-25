
/**
 * config:
 ** label: String (Visible tab; defaults 'Chat to the team!')
 ** widgetWidth: Number (width of chat window - defaults 300(px))
 ** marginFromRight: Number (pixels from right of screen - defaults 50(px))
 ** btnColor: String (css color, defaults - '#3b80c1')
 ** tabColor: String (css color default - '#cd5a54')
 ** chattaActiveColor: String (css color defaults -'#36c498')
 ** userDetailsFooterColor: String (css defaults to '#36c498')
 ** errorColor: String (css defaults to '#cd5a54')
 */


window.chatta = (function(config) {

  var noop = function() {};
  var _dom = [];
  var upArrow = '&#9650;';
  var downArrow = '&#9660;';
  var widgetWidth = config&&config.widgetWidth||300;
  var screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var marginFromRight = config&&config.marginFromRight||50;

  if((widgetWidth+(marginFromRight*2))>screenWidth) {
    marginFromRight = 20;
    widgetWidth = screenWidth-(marginFromRight*2);
  }

  // --------------------------------------------------
  // -- Request animation frame shim
  // --------------------------------------------------

  (function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  }());

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
    var top = parseInt(this.css('bottom'), 10),
        dy = top - y, i = 1, count = 20, _this = this;

    function frame() {
      if ( i >= count ) { return (cb||noop)(); }
      i += 1;
      _this._elm.style.bottom = (top - (dy * i / count)).toFixed(0) + 'px';
      window.requestAnimationFrame(frame);
    }

    frame();
  };

  // GEt computed css from element
  Element.prototype.css = function(property) {
    return window.getComputedStyle( this._elm, null )
      .getPropertyValue( property );
  }


  // Gets value from field
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
  var $chattaTabText    = new Element('span', 'chatta_tab_text');
  var $chattaTabArrow   = new Element('span', 'chatta_tab_arrow');
  var $chattaBox        = new Element('div', 'chatta_box');
  var $chattaFormWrap   = new Element('div', 'chatta_form_wrap');
  var $chattaForm       = new Element('form', 'chatta_form');
  var $chattaEmailField = new Element('input', 'chatta_email_field');
  var $chattaNameField  = new Element('input', 'chatta_name_field');
  var $chattaMessageBox = new Element('textarea', 'chatta_message_box');
  var $chattaSubmit     = new Element('input', 'chatta_submit');
  var $chattaUserDetails= new Element('div', 'chatta_user_details');
  var $chattaLight      = new Element('span', 'chatta_light');

  // Set attributes if needed
  $chattaTabArrow.setText(upArrow);
  $chattaTabText.setText(config&&config.label||'Chat to the team!');
  $chattaEmailField.attr('type', 'text');
  $chattaEmailField.attr('placeholder', 'Your email');
  $chattaNameField.attr('type', 'text');
  $chattaNameField.attr('placeholder', 'Your name');
  $chattaMessageBox.attr('placeholder', 'Your message');
  $chattaSubmit.attr('type', 'submit');
  $chattaSubmit.attr('value', 'Send');

  // Add styles
  $chattaWrap.addStyles({
    'width':widgetWidth + 'px',
    'background':'#fff',
    'position':'fixed',
    'bottom':'-500px',
    'right':marginFromRight+'px',
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
    'background':config.tabColor||'#cd5a54',
    'color':'#fff'
  });

  $chattaLight.addStyles({
    'background':config.chattaActiveColor||'#36c498',
    'margin-right':'10px',
    'width':'10px',
    'height':'10px',
    'display':'inline-block',
    'border-radius':'25px',
    'margin-top':'5px'
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
    'width': widgetWidth + 'px',
    'padding':'10px',
    'bottom':'0px',
    'background':'#fff',
    'left':'0px'
  });

  var chattaInputStyle = {
    'width':(widgetWidth-20)+'px',
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
    'width':(widgetWidth-20)+'px',
    'border':'none',
    '-webkit-border-radius':'3px',
    '-webkit-border-radius':'3px',
    '-moz-border-radius':'3px',
    '-moz-border-radius':'3px',
    'border-radius':'3px',
    'border-radius':'3px',
    'margin-bottom':'7px',
    'background-color':config.btnColor||'#3b80c1',
    'padding':'7px 0px',
    'color':'#fff',
    'top':'0px'
  });

  $chattaUserDetails.addStyles({
    'text-align':'center',
    'background':config.userDetailsFooterColor||'#36c498',
    'color':'#fff',
    'padding':'4px',
    'font-size':'11px',
    'display':'none'
  });

  // Create tree
  $chattaTab.append($chattaLight);
  $chattaTab.append($chattaTabText);
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
      initialFormSubmission: noop,
      mssgKeyup: noop,
      emailKeyup: noop,
      nameKeyup: noop,
      anySubmission: noop
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
      _this._events.anySubmission(e);
      if(this.connectionError) return;
      _this.resetErrorState();

      var formData = _this._getFormData();
      var success = true;

      // If this is the first message callback
      if(!_this._messages.length)
        success = _this._events.initialFormSubmission(formData);

      // On every form submission callback
      if(success) _this._events.formSubmission(formData);

      // Prevent form submission
      e.preventDefault();
    }

    // Call submit on submit event and 'enter'
    $chattaForm.on('submit', formSubmit);
    $chattaEmailField.on('keyup', this._events.emailKeyup);
    $chattaNameField.on('keyup', this._events.nameKeyup);
    $chattaMessageBox.on('keyup', function(e) {
      e = e || event;
      this._events.mssgKeyup(e);
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
    data.message = data.message.replace(/(?:\r\n|\r|\n)/g, '');
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

  // Clear the textarea
  $chatta.clearMessageBox = function() {
    $chattaMessageBox.val('');
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
    // Reset error mssg background color/hide
    $chattaUserDetails.addStyles({
      'background':config.userDetailsFooterColor||'#36c498',
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
      'background':config.errorColor||'#cd5a54'
    });

    // Set message text
    $chattaUserDetails.setText(message || 'Form error');

    // If name error set red border
    if(nameErr)
      $chattaNameField.addStyles({
        'border':'1px solid ' + (config.errorColor||'#cd5a54')
      });

    // If email error set red border
    if(emailErr)
      $chattaEmailField.addStyles({
        'border':'1px solid ' + (config.errorColor||'#cd5a54')
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
      'display':(hide) ? 'none':'block'
    });
    $chattaNameField.addStyles({
      'display':(hide) ? 'none':'block'
    });
  };

  // Call 'on' to subscribe to widget events
  $chatta.on = function(event, callback) {
    this._events[event] = callback;
  };

  // Add ui changes if connection is lost
  $chatta.setFormError = function(on, message) {
    if(on) {
      this.connectionError = true;
      $chattaSubmit.attr('value', message||'Error!');
      $chattaSubmit.addStyles({
        'background':config.errorColor||'#cd5a54',
        'opacity':'0.7'
      });
      $chattaSubmit.getElement().disabled = true;
    } else {
      $chattaSubmit.attr('value', 'Send');
      this.connectionError = false;
      $chattaSubmit.addStyles({
        'background':config.btnColor||'#3b80c1',
        'opacity':'1'
      });
      $chattaSubmit.getElement().disabled = false;
    }
  };

  // PRIVATE: count matching elms in array
  $chatta._countOccuranceOf = function(array, condition) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
      count=condition(array[i]) ? count+1 : count;
    }
    return count;
  };

  // Returns total amount of messages
  $chatta.getTotalMessages = function(isRight) {
    if(typeof isRight === 'undefined')
      return this._messages.length;

    return this._countOccuranceOf(this._messages,
      function(item) {
        return isRight&&item.isRight||!item.isRight;
      });
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
});
