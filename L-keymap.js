var L;
L.input = {};

L.input.keyCodeFromString = function(string)
{
    var upString = string.toUpperCase();
    if (upString.match(/^[A-Z0-9]$/))
    {
	return upString.charCodeAt(0);
    }

    if (upString.indexOf("NUMPAD") === 0)
    {
	return 96 + parseInt(upString.charAt(upString.length - 1));
    }

    if (upString.indexOf("F") === 0)
    {
	return 111 + parseInt(upString.replace("F", ""));
    }

    switch (upString)
    {
	case "MULTIPLY":
	    return 106;
	    break;

	case "ADD":
	    return 107;
	    break;

	case "ENTER":
	    return 13;
	    break;

	case "SUBTRACT":
	    return 109;
	    break;

	case "DECIMAL":
	    return 110;
	    break;

	case "DIVIDE":
	    return 111;
	    break;

	case "BACKSPACE":
	case "BACK":
	    return 8;
	    break;

	case "TAB":
	    return 9;
	    break;

	case "SHIFT":
	    return 16;
	    break;

	case "CONTROL":
	case "CTRL":
	    return 17;
	    break;

	case "CAPS":
	case "CAPSLOCK":
	case "CAPS LOCK":
	    return 20;
	    break;

	case "ESC":
	case "ESCAPE":
	    return 27;
	    break;

	case "SPACE":
	case "SPACEBAR":
	    return 32;
	    break;

	case "PGUP":
	case "PAGEUP":
	case "PAGE UP":
	    return 33;
	    break;

	case "PGDN":
	case "PAGEDOWN":
	case "PAGE DOWN":
	    return 34;
	    break;

	case "END":
	    return 35;
	    break;

	case "HOME":
	    return 36;
	    break;

	case "LEFT":
	case "LEFTARROW":
	case "LEFT ARROW":
	    return 37;
	    break;

	case "UP":
	case "UPARROW":
	case "UP ARROW":
	    return 38;
	    break;

	case "RIGHT":
	case "RIGHTARROW":
	case "RIGHT ARROW":
	    return 39;
	    break;

	case "DOWN":
	case "DOWNARROW":
	case "DOWN ARROW":
	    return 40;
	    break;

	case "INSERT":
	    return 45;
	    break;

	case "DELETE":
	    return 46;
	    break;

	case "NUMLOCK":
	case "NUM LOCK":
	    return 144;
	    break;

	case "SCRLK":
	case "SCROLLLOCK":
	case "SCROLL LOCK":
	    return 145;
	    break;

	case "PAUSE":
	case "PAUSEBREAK":
	case "PAUSE BREAK":
	    return 19;
	    break;

	case ";":
	case ":":
	    return 186;
	    break;

	case "=":
	case "+":
	    return 187;
	    break;

	case "-":
	case "_":
	    return 198;
	    break;

	case "/":
	case "?":
	    return 191;
	    break;

	case "~":
	case "`":
	    return 192;
	    break;

	case "[":
	case "{":
	    return 219;
	    break;

	case "\\":
	case "|":
	case "BACKSLASH":
	    return 220;
	    break;

	case "]":
	case "}":
	    return 221;
	    break;

	case "'":
	case '"':
	case "QUOTE":
	case "QUOTES":
	    return 222;
	    break;

	case ",":
	case "<":
	    return 188;
	    break;

	case ".":
	case ">":
	    return 190;
	    break;

	default:
	    alert("'" + string + "' is not a valid key identifier.");
	    break;
    }
};

L.input.Keymap = function()
{
    this.bindings = {};
};

L.input.Keymap.prototype.doKeyDown = function(event)
{
    var keyCode = event.keyCode;
    if (this.bindings[keyCode])
    {
	this.bindings[keyCode]();
    }
};

L.input.Keymap.prototype.bindKey = function(key, callback)
{
    this.bindKeyCode(L.input.keyCodeFromString(key), callback);
};

L.input.Keymap.prototype.bindKeyCode = function(keyCode, callback)
{
    this.bindings[keyCode] = callback;
};