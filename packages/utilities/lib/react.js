// src/bodyScrollLock.ts
var lockCount = 0;
var bodyOverflow = "";
var htmlOverflow = "";
var bodyPosition = "";
var bodyTop = "";
var bodyWidth = "";
var lockedScrollY = 0;
function applyLock() {
  if (typeof document === "undefined") return;
  lockedScrollY = window.scrollY;
  bodyOverflow = document.body.style.overflow;
  htmlOverflow = document.documentElement.style.overflow;
  bodyPosition = document.body.style.position;
  bodyTop = document.body.style.top;
  bodyWidth = document.body.style.width;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.width = "100%";
}
function releaseLock() {
  if (typeof document === "undefined") return;
  document.body.style.overflow = bodyOverflow;
  document.documentElement.style.overflow = htmlOverflow;
  document.body.style.position = bodyPosition;
  document.body.style.top = bodyTop;
  document.body.style.width = bodyWidth;
  window.scrollTo(0, lockedScrollY);
}
function acquireBodyScrollLock() {
  if (typeof document === "undefined") return () => {
  };
  lockCount += 1;
  if (lockCount === 1) applyLock();
  return () => {
    lockCount -= 1;
    if (lockCount <= 0) {
      lockCount = 0;
      releaseLock();
    }
  };
}

// src/composeRefs.ts
import * as React from "react";
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref != null) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (instance) => refs.forEach((ref) => setRef(ref, instance));
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}
var composeRef = composeRefs;

// src/mergeTriggerChild.ts
import { Children, Fragment, isValidElement } from "react";
function getMergeableTriggerChild(children) {
  let node;
  try {
    node = Children.only(children);
  } catch {
    return null;
  }
  if (!isValidElement(node)) return null;
  if (node.type === Fragment) {
    const inner = Children.toArray(node.props.children);
    if (inner.length !== 1 || !isValidElement(inner[0])) return null;
    return inner[0];
  }
  return node;
}

// src/Slot.tsx
import {
  cloneElement,
  forwardRef,
  isValidElement as isValidElement2
} from "react";
import { Fragment as Fragment2, jsx } from "react/jsx-runtime";
function mergeProps(slotProps, childProps) {
  const merged = { ...slotProps };
  for (const key of Object.keys(childProps)) {
    if (key === "ref" || key === "children") continue;
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    const isEvent = key.startsWith("on") && typeof slotValue === "function" && typeof childValue === "function";
    if (key === "className" || key === "aria-describedby") {
      merged[key] = [slotValue, childValue].filter(Boolean).join(" ");
    } else if (key === "style") {
      merged.style = { ...slotValue ?? {}, ...childValue ?? {} };
    } else if (isEvent) {
      merged[key] = (event) => {
        childValue(event);
        if (!event?.defaultPrevented) slotValue(event);
      };
    } else {
      merged[key] = childValue;
    }
  }
  return merged;
}
var Slot = forwardRef(function Slot2({ children, ...slotProps }, forwardedRef) {
  if (!isValidElement2(children)) {
    return /* @__PURE__ */ jsx(Fragment2, { children });
  }
  const child = children;
  const childProps = { ...child.props ?? {} };
  const childRef = child.ref ?? childProps.ref;
  delete childProps.ref;
  delete childProps.children;
  const merged = mergeProps(slotProps, childProps);
  merged.ref = composeRefs(forwardedRef, childRef);
  return cloneElement(child, merged);
});
export {
  Slot,
  acquireBodyScrollLock,
  composeRef,
  composeRefs,
  getMergeableTriggerChild,
  useComposedRefs
};
