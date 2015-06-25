
# Chatta

In short, its similar to the widget that olark and alike provide, just without all the backend and frontend logic.

I wanted a simple chat widget to allow me to build into my own system and integrate with Slack, and this is the result. It has zero dependencies, no extra css files; just a single file and api, written in pure JavaScript.

*Note:* This is still a work in progress - hardly tested and only in Chrome, so feel free to contibute!

## The Widget

![Website Chat Widget (Chatta)](https://github.com/kirkness/chatta/blob/master/example.gif)

## Install

Either

```
$ bower install chatta
```
Or
```
$ git clone https://github.com/kirkness/chatta.git
```

#### The most basic implementation.

```js
chatta.init(function(chat) {
  chat.on('formSubmission', function(data) {
    console.log(data);
  });
});
```


## Simple Example (as seen in the gif above)

``` js

// Optional config object
var config = { label: 'Live chat!' };

// Start by initialising the widget
chatta(config).init(function(chat) {


  /**
   * Add an event handler for the forms initial submission.
   * The initial will (if you choose) submit
   * will provide the message and user data from the form.

   * i.e. data = { message: ..., user: { name: ..., email: ... } }
   */

  chat.on('initialFormSubmission', function(data) {

    /**
     * Setting the user will add a bar to the foot of the widget.
     * The bar just tells the user that they are chatting as <name>, <email>
     */

    var success = chat.setUser(data.user);

    /**
     * If the user model is valid hide the user fields
     */

    if(success) {
      chat.hideUserFields(true);

      /**
       * Return true allowing the following form submission to be called
       */

      return true;
    }

    /**
     * There are errors so pass 'message', nameErr<Boolean>, email<Boolean>
     */

    chat.setErrors('Form errorsssss!', (data.user.name === false) ? true : false, (data.user.email === false) ? true : false);

    /**
     * Return false to prevent firing 'formSubmission'
     */

    return false;
  });


  /**
   * Subscribe to any form submission

   * data = { message: ..., user: { name: ..., email: ... } }
   */

  chat.on('formSubmission', function(data) {

    /**
     * data.message will === false if it doesnt exist
     * As will data.user.name & data.user.email (includes validation)
     */

    if(data.message)

      /**
       * Append the message to the widget
       */

      chat.addMessage({
        from: 'Me',
        content: data.message,
        date: new Date(),
        isRight: true
      });
  });
});
```

## Config

Optional config object passed in `chatta(config)`.

 - config:
    - label: String (Visible tab; defaults 'Chat to the team!')
    - widgetWidth: Number (width of chat window - defaults 300(px))
    - marginFromRight: Number (pixels from right of screen - defaults 50(px))
    - btnColor: String (css color, defaults - '#3b80c1')
    - tabColor: String (css color default - '#cd5a54')
    - chattaActiveColor: String (css color defaults -'#36c498')
    - userDetailsFooterColor: String (css defaults to '#36c498')
    - errorColor: String (css defaults to '#cd5a54')

## Events

Subscribe to widget events using `chat.on(event)`.

 - `opened` - Called when widget opens
 - `closed` - Called when widget closes
 - `formSubmission` - Called when form is successfully submitted
 - `initialFormSubmission` - Called on initial successfull submission
 - `mssgKeyup` - Called on keyup of message box input
 - `emailKeyup` - Called on keyup of email field input
 - `nameKeyup` - Called on name input keyup
 - `anySubmission` - Called whenever the form is submitted


## API
| Method            | Params                                                                                                               | Returns                                                          | Callback args | Description                                                                    |
|-------------------|----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|---------------|--------------------------------------------------------------------------------|
| `init`            | `Function` (callback)                                                                                                | `this`                                                           | none          |                                                                                |
| `addMessage`      | `Object` `{   from: String,   content: String,   date: Date,   isRight: Boolean (align the message right or left) }` | `Boolean` Error                                                  | n/a           | Append a message to the chat window                                            |
| `display`         | n/a                                                                                                                  | `this`                                                           | n/a           | Shows (`display:block`) the widget                                             |
| `hide`            | n/a                                                                                                                  | `this`                                                           | n/a           | Hides (`display:none`) the widget                                              |
| `setErrors`       | `String`, `Boolean`, `Boolean`  - Message string  - Has name error?  - Has email error?                              | `this`                                                           | n/a           | Adds the error footer with message and red borders to appropriate fields       |
| `resetErrorState` | n/a                                                                                                                  | `this`                                                           | n/a           | Resets and hides all error highlights                                          |
| `toggleBox`       | `Function` callback                                                                                                  | `this`                                                           | none          | Animates the widget up/down                                                    |
| `getUser`         | n/a                                                                                                                  | `Object` `{   name: String||Boolean,   email: String||Boolean }` | n/a           | Get the user                                                                   |
| `setUser`         | `Object` `{   name: String,   email: String }`                                                                       | `Boolean`                                                        | n/a           | Set user, adds footer to widget with name and email. Returns if user is valid. |
| `showTab`         | `Boolean` (Should animate), `Function`(callback)                                                                     | `this`                                                           | none          | Sets widget to only show tab. i.e. hides the chat widget.                      |
| `setFormError`    | `Boolean` (toggle error on/off), String (message to display on button)                                               | `this`                                                           | none          | Toggle form error on/off (stops form from being able to submit - handy for connection loss) |
