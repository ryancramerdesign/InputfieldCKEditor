# CKEditor for ProcessWire

[CKEditor](http://ckeditor.com/) is a web text editor like TinyMCE. 
This module can be used anywhere TinyMCE can be used in ProcessWire. 

CKEditor has a nice *inline* mode that is desirable in the page editor 
when you may have lots of rich text inputs. The reason for this is 
that the page editor loads a lot faster. Some people also prefer 
CKEditor for other reasons. 

This module is tested and confirmed compatible with both repeaters and 
multi-language support. 

## How to install

1. Install the [MarkupHTMLPurifier module](https://github.com/ryancramerdesign/MarkupHTMLPurifier) 
   module (required for inline mode).

2. Copy all the files from this module into: `/site/modules/InputfieldCKEditor/` 

3. Login to your admin and go to **Modules > Check for new modules**. 
   Click **install** for **InputfieldCKEditor**. 

4. Now go to **Setup > Fields** and locate a textarea field that you want 
   to use CKEditor (or create a new textarea field).

5. When editing the settings for a textarea field, click the **Details** tab. 
   Change the **Inputfield Type** to **CKEditor** and save.

6. While still editing the field settings, click to the **Input** tab for 
   CKEditor-specific settings you may optionally configure. 

## Requirements

Requires ProcessWire 2.2.9+ or newer. 

If you want to use CKEditor inline mode, the [MarkupHTMLPurifier module](https://github.com/ryancramerdesign/MarkupHTMLPurifier) 
is also required. 

