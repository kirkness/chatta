
# Chatta

In short, its similar to the widget that olark and alike provide, just without all the backend and frontend logic.

I wanted a simple chat widget to allow me to build into my own system and integrate with Slack, and this is the result. It has zero dependencies, no extra css files; just a single file and api, written in pure JavaScript.

## The Widget

![Website Chat Widget (Chatta)](https://github.com/kirkness/chatta/blob/master/example.gif)


## Simple Example (as seen in the gif above)

``` js
// Start by initialising the widget
chatta().init(function(chat) {


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

## API 

| Method            | Params                                                                                                             | Returns                                                        | Callback args | Description                                                              |
|-------------------|--------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|---------------|--------------------------------------------------------------------------|
| `addMessage`      | <Object> {   from: String,   content: String,   date: Date,   isRight: Boolean (align the message right or left) } | <Boolean> Error                                                | n/a           | Append a message to the chat window                                      |
| `display`         | n/a                                                                                                                | this                                                           | n/a           | Shows (`display:block`) the widget                                       |
| `hide`            | n/a                                                                                                                | this                                                           | n/a           | Hides (`display:none`) the widget                                        |
| `setErrors`       | <String>, <Boolean>, <Boolean>  - Message string  - Has name error?  - Has email error?                            | this                                                           | n/a           | Adds the error footer with message and red borders to appropriate fields |
| `resetErrorState` | n/a                                                                                                                | this                                                           | n/a           | Resets and hides all error highlights                                    |
| `toggleBox`       | <Function> callback                                                                                                | this                                                           | none          | Animates the widget up/down                                              |
| `getUser`         | n/a                                                                                                                | <Object> {   name: String||Boolean,   email: String||Boolean } | n/a           | Get the user                                                             |
| `setUser`         | <Object> {   name: String,   email: String }                                                                       |                                                                |               |                                                                          |
|                   |                                                                                                                    |                                                                |               |                                                                          |
