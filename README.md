form2json
====================

Adds the method `.serializeJSON()` to [jQuery](http://jquery.com/) that serializes a form into a JavaScript Object with the same format as the default Ruby on Rails request params hash, and also it's a [W3C Working Draft](http://www.w3.org/TR/2014/WD-html-json-forms-20140529/).


Usage Example
-------------

HTML form (input, textarea and select tags supported):

~~~html

<form id="my-profile">
  <!-- simple attribute -->
  <input type="text" name="fullName"              value="James Zhan" />

  <!-- nested attributes -->
  <input type="text" name="address[city]"         value="Shenzhen" />
  <input type="text" name="address[state][name]"  value="Guangdone" />
  <input type="text" name="address[state][abbr]"  value="CN" />

  <!-- array -->
  <input type="text" name="hobbies[]"             value="coding" />
  <input type="text" name="hobbies[]"             value="reading" />

  <!-- and more ... -->
  <textarea              name="projects[0][name]">form2json</textarea>
  <textarea              name="projects[0][language]">javascript</textarea>
  <input type="checkbox" name="projects[0][popular]" checked="checked"/>

  <textarea              name="projects[1][name]">peony</textarea>
  <textarea              name="projects[1][language]">ruby</textarea>
  <input type="checkbox" name="projects[1][popular]" value="1"/>
</form>

~~~

JavaScript:

~~~javascript

$('#my-profile').serializeJSON();
// returns =>
{
    fullName: "James Zhan",
    address: {
        city: "Shenzhen",
        state: {
            name: "Guangdone",
            abbr: "CN"
        }
    },
    hobbies: ["coding", "reading"],
    projects: [
        { name: "form2json", language: "javascript", popular: true },
        { name: "peony", language: "ruby" }
    ]
}
~~~

[W3C HTML JSON form submission](http://www.w3.org/TR/2014/WD-html-json-forms-20140529/) have listed all the mapping rules.


Install
-------

Install it like any other jQuery plugin.
For example, download the [form2json.js](https://raw.githubusercontent.com/jameszhan/form2json/master/form2json.js) script and include it in your page after jQuery:

```html
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="form2json.js"></script>
```

Alternatives
------------

I found others solving the same problem:
 * https://github.com/marioizquierdo/jquery.serializeJSON
 * https://github.com/macek/jquery-serialize-object
 * https://github.com/hongymagic/jQuery.serializeObject
 * https://github.com/danheberden/jquery-serializeForm
 * https://github.com/maxatwork/form2js (plain js, no jQuery)
 * https://github.com/serbanghita/formToObject.js (plain js, no jQuery)
 

Why serialize a form?
---------------------

Probably to submit via AJAX, or to handle user input in your JavaScript application.

To submit a form using AJAX, the jQuery [.serialize()](https://api.jquery.com/serialize/) function should work just fine. Most backend frameworks will understand the form attribute names and convert them to accessible values that can be easily assigned to your backend models.

Actually, the input name format used by `.serializeJSON()` is borrowed from [Rails Parameter Naming Conventions](http://guides.rubyonrails.org/form_helpers.html#understanding-parameter-naming-conventions).

But if you want to handle user input in the frontend JavaScript application, then `.serialize()` is not very useful because it just creates a params string. Another jQuery function is `.serializeArray`, but it doesn't handle nested objects.


Usage details
-------------

The current implementation of `.serializeJSON()` relies on jQuery's [.serializeArray()](https://api.jquery.com/serializeArray/) to grab the form attributes and then create the object using the names.

It means, it will serialize the inputs that are supported by `.serializeArray()`, that uses the standard W3C rules for [successful controls](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2) to determine which elements it should include; in particular the element cannot be disabled and must contain a name attribute. No submit button value is serialized since the form was not submitted using a button. Data from file select elements is not serialized.


Author
-------

Written by [James Zhan](https://github.com/jameszhan)




