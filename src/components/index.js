const svg = require("./svg/index");
const XBidPanel = require("./XBidPanel");
const XGodCard = require("./XGodCard");
const XIcon = require("./XIcon");
const XItemPrice = require("./XItemPrice");
const XMap = require("./XMap");
const XMapCounter = require("./XMapCounter");
const XMapIconContainer = require("./XMapIconContainer");
const XOverlay = require("./XOverlay");
const XPanel = require("./XPanel");
const XPastille = require("./XPastille");
const XPlayerIcon = require("./XPlayerIcon");
const XPlayerPanel = require("./XPlayerPanel");
const XPossibleAction = require("./XPossibleAction");
const XReset = require("./XReset");
const XRoot = require("./XRoot");
const XSesterces = require("./XSesterces");
const XSnackbar = require("./XSnackbar");
const XTooltip = require("./XTooltip");
const jsDeps = {
	XBidPanel,
	XGodCard,
	XIcon,
	XItemPrice,
	XMap,
	XMapCounter,
	XMapIconContainer,
	XOverlay,
	XPanel,
	XPastille,
	XPlayerIcon,
	XPlayerPanel,
	XPossibleAction,
	XReset,
	XRoot,
	XSesterces,
	XSnackbar,
	XTooltip
}

module.exports = Object.assign({}, jsDeps, svg)