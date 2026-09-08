// src/version.ts
var packagesCache = {};
var _win = void 0;
try {
  _win = window;
} catch (e) {
}
function version(packageName, packageVersion) {
  if (typeof _win !== "undefined") {
    const packages = _win.__packages__ = _win.__packages__ || {};
    if (!packages[packageName] || !packagesCache[packageName]) {
      packagesCache[packageName] = packageVersion;
      const versions = packages[packageName] = packages[packageName] || [];
      versions.push(packageVersion);
    }
  }
}

// src/index.ts
version("@refineui/version", "1.0.0");
export {
  version
};
