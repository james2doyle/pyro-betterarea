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
      <a href="#bold">Bold</a> |
      <a href="#italic">Italic</a> |
      <a href="#code">Code</a> |
      <a href="#code-block">Code Block</a> |
      <a href="#quote">Quote</a> |
      <a href="#ul-list"><abbr title="Unordered List">UL</abbr></a> |
      <a href="#ol-list"><abbr title="Ordered List">OL</abbr></a> |
      <a href="#link">Link</a> |
      <a href="#image">Image</a> |
      <a href="#h1">H1</a> |
      <a href="#h2">H2</a> |
      <a href="#h3">H3</a> |
      <a href="#h4">H4</a> |
      <a href="#h5">H5</a> |
      <a href="#h6">H6</a> |
      <a href="#hr">Horizontal Rule</a> |
      <a href="#undo">Undo</a> |
      <a href="#redo">Redo</a>
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
