<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
* betterarea Field Type
*
* @package		Addons\Field Types
* @author		James Doyle (james2doyle)
* @license		MIT License
* @link		http://github.com/james2doyle/pyro-betterarea
*/
class Field_betterarea
{
  public $field_type_slug    = 'betterarea';
  public $db_col_type        = 'text';
  public $version            = '1.0.0';
  public $custom_parameters		= array('default_value');
  public $author             = array(
		'name' => 'James Doyle',
		'url' => 'http://github.com/james2doyle/pyro-icons-field'
		);
  // --------------------------------------------------------------------------

  public function __construct()
  {
    $this->CI =& get_instance();
  }
    /**
    * Output form input
    *
    * @param	array
    * @param	array
    * @return	string
    */
    public function form_output($data)
    {
      $options['name'] 	= $data['form_slug'];
      $options['id']		= $data['form_slug'];
      $options['value']	= $data['value'];

      $template = '<div class="editor-control">
      <a href="#bold">'.$this->CI->lang->line('streams:betterarea.bold').'</a> |
      <a href="#italic">'.$this->CI->lang->line('streams:betterarea.italic').'</a> |
      <a href="#code">'.$this->CI->lang->line('streams:betterarea.code').'</a> |
      <a href="#code-block">'.$this->CI->lang->line('streams:betterarea.code_block').'</a> |
      <a href="#quote">'.$this->CI->lang->line('streams:betterarea.quote').'</a> |
      <a href="#ul-list"><abbr title="'.$this->CI->lang->line('streams:betterarea.ul').'">'.$this->CI->lang->line('streams:betterarea.ul_short').'</abbr></a> |
      <a href="#ol-list"><abbr title="'.$this->CI->lang->line('streams:betterarea.ol').'">'.$this->CI->lang->line('streams:betterarea.ol_short').'</abbr></a> |
      <a href="#link">'.$this->CI->lang->line('streams:betterarea.link').'</a> |
      <a href="#image">'.$this->CI->lang->line('streams:betterarea.image').'</a> |
      <a href="#h1">'.$this->CI->lang->line('streams:betterarea.h1').'</a> |
      <a href="#h2">'.$this->CI->lang->line('streams:betterarea.h2').'</a> |
      <a href="#h3">'.$this->CI->lang->line('streams:betterarea.h3').'</a> |
      <a href="#h4">'.$this->CI->lang->line('streams:betterarea.h4').'</a> |
      <a href="#h5">'.$this->CI->lang->line('streams:betterarea.h5').'</a> |
      <a href="#h6">'.$this->CI->lang->line('streams:betterarea.h6').'</a> |
      <a href="#hr">'.$this->CI->lang->line('streams:betterarea.hr').'</a> |
      <a href="#undo">'.$this->CI->lang->line('streams:betterarea.undo').'</a> |
      <a href="#redo">'.$this->CI->lang->line('streams:betterarea.redo').'</a>
    </div>';

      return '<div class="betterarea">'.$template.form_textarea($options).'</div>';
    }

    /**
    * Pre Output
    *
    * Parse the area with Markdown
    *
    * @return string
    */
    public function pre_output($input)
    {
      $this->CI->load->helper('markdown');
      return parse_markdown($input);
    }

  public function event($field)
  {
    $this->CI->type->add_js('betterarea', 'betterarea.js');
    $this->CI->type->add_js('betterarea', 'library.js');
    $this->CI->type->add_css('betterarea', 'betterarea.css');
  }
}
