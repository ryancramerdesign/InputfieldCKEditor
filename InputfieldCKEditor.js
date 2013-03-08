$(document).ready(function() {

	var $inlines = $(".InputfieldCKEditorInline"); 
	var pageID = $("#Inputfield_id").val();

	if($inlines.size() > 0) {

		CKEDITOR.disableAutoInline = true; 

		$inlines.mouseover(function() {
			// we initialize the inline editor only when moused over
			// so that a page can handle lots of editors at once without
			// them all being active
			var $t = $(this);
			if($t.is(".InputfieldCKEditorLoaded")) return;
			$t.effect('highlight', {}, 500); 
			$t.attr('contenteditable', 'true'); 
			var configName = $t.attr('data-configName'); 
			CKEDITOR.inline($(this).attr('id'), config[configName]); 
			$t.addClass("InputfieldCKEditorLoaded"); 
		});

		$("form.InputfieldForm").submit(function() {
			$(this).find('.InputfieldCKEditorInline').each(function() {
				var $input = $(this).next('input'); 
				var value = $(this).html();
				$input.attr('value', value); 
			}); 
		}); 	
	}
}); 
