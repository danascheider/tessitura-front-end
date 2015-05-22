var string = "<fieldset class='form-group login-information'>\n  <legend>Login Information</legend>\n  <input class='form-control' name='username' title='Username' placeholder='Username (required)'>\n  <input class='form-control half-width left' type='password' name='password' title='Password' placeholder='Password (required)'>\n  <input class='form-control half-width right' type='password' name='password-confirmation' title='Re-type Password' placeholder='Re-type Password (required)'>\n  <input class='form-control half-width left' type='email' name='email' title='E-mail Address' placeholder='E-mail (required)'>\n  <input class='form-control half-width right' type='email' name='email-confirmation' title='Re-type E-mail' placeholder='Re-type E-mail (required)'> \n</fieldset>\n<fieldset class='form-group profile-information'>\n  <legend>Profile Information</legend>\n  <input class='form-control half-width left' name='first_name' title='First Name' placeholder='First Name'>\n  <input class='form-control half-width right' name='last_name' title='Last Name' placeholder='Last Name'>\n  <input class='form-control half-width left' name='birthdate' type='date' title='Date of Birth'>\n  <input class='form-control half-width right' name='fach' list='fachs' title='Fach' placeholder='Fach'>\n\n  <datalist id='fachs'>\n    <option value='Soprano - lyric coloratura' />\n    <option value='Soprano - dramatic coloratura' />\n    <option value='Soprano - lyric' />\n    <option value='Soprano - spinto' />\n    <option value='Soprano - dramatic' />\n    <option value='Mezzo-soprano - Rossini' />\n    <option value='Mezzo-soprano - lyric' />\n    <option value='Mezzo-soprano - dramatic' />\n    <option value='Contralto' />\n    <option value='Countertenor' />\n    <option value='Tenor leggiero' />\n    <option value='Tenor - lyric' />\n    <option value='Tenor - spinto' />\n    <option value='Heldentenor' />\n    <option value='Lyric baritone' />\n    <option value='Dramatic baritone' />\n    <option value='Lyric bass' />\n    <option value='Basso buffo' />\n    <option value='Basso profondo' />\n    <option value='Other' />\n  </datalist>\n\n  <input class='form-control half-width left' name='country' title='Country' placeholder='Country'>\n  <input class='form-control half-width right' name='city' title='City' placeholder='City'>\n</fieldset>\n<fieldset class='form-group terms'>\n  <div class='checkbox'>\n    <input class='checkbox' type='checkbox' name='acceptTerms' value='Accept Terms'><label for='acceptTerms'>I accept the <a href='#'>Terms of Use</a></label>\n  </div>\n</fieldset>\n<fieldset class='form-group submit'>\n  <button type='submit' class='btn btn-dark half-width'>Create Account</button>\n  <button type='reset' class='btn btn-dark half-width'>Clear Form</button>\n</fieldset>";

module.exports = string;
