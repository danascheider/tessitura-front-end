var string = "<select name='type'>\n  <option<%= (!model || model.get('type') === 'soprano') ? ' selected' : ''%>>Soprano</option>\n  <option<%= model && model.get('type') === 'mezzo-soprano' ? ' selected' : ''%>>Mezzo-soprano</option>\n  <option<%= model && model.get('type') === 'contralto' ? ' selected' : ''%>>Contralto</option>\n  <option<%= model && model.get('type') === 'countertenor' ? ' selected' : ''%>>Countertenor</option>\n  <option<%= model && model.get('type') === 'tenor' ? ' selected' : ''%>>Tenor</option>\n  <option<%= model && model.get('type') === 'baritone' ? ' selected' : ''%>>Baritone</option>\n  <option<%= model && model.get('type') === 'bass' ? ' selected' : ''%>>Bass</option>\n</select>\n\n<select name='quality' class='hidden'>\n  <option<%= (!model || model.get('quality') === 'lyric') ? ' selected' : '' %>>Lyric</option>\n  <option<%= model && model.get('quality') === 'dramatic' ? ' selected' : '' %>>Dramatic</option>\n</select>\n\n<input name='coloratura' type='checkbox' class='checkbox hidden' />";

module.exports = string;