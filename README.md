# CKEditor rich text/HTML editor module for ProcessWire

This is currently a work in progress, not yet ready for production use. However, it should be fine to use and test outside of that. 

This does not yet do everything our TinyMCE module does, but it will by the time we are done with it. 

I am putting this on GitHub now rather than later in case anyone else wants to participate in the development of it. Also, for backup purposes. :)

This module is tested and confirmed compatible with both repeaters and multi-language support. 

Like with TinyMCE will be overriding the *link* and *image* dialogs in CKEditor. Currently only the *link* dialog is functional in that respect, and the *image* dialog will be soon. As a result, the *image* dialog uses the CKEditor default at present.

## Requirements

Requires ProcessWire 2.2.9+ or newer. If you want to use CKEditor inline mode, the [MarkupHTMLPurifier module](https://github.com/ryancramerdesign/MarkupHTMLPurifier) is also required. 

