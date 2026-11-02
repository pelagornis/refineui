/** Panel edge that carries the beak — opposite of the placement side. */
export type FloatingBeakSide = "top" | "right" | "bottom" | "left";
export type FloatingBeakAlign = "start" | "center" | "end";

export type FloatingOutlineInput = {
    /** Panel border-box size (px). */
    panelWidth: number;
    panelHeight: number;
    radius: number;
    side: FloatingBeakSide;
    /** Beak center along the panel edge, measured from the panel's top or left (px). */
    beakCenter: number;
    beakWidth: number;
    beakHeight: number;
    tipRadius: number;
    /** Shrinks the outline inward so a centered stroke stays inside the shape. */
    inset?: number;
};

type Point = { x: number; y: number };

const PATH_PRECISION = 100;

function fmt(n: number): string {
    return String(Math.round(n * PATH_PRECISION) / PATH_PRECISION);
}

function pt(p: Point): string {
    return `${fmt(p.x)} ${fmt(p.y)}`;
}

function towards(from: Point, to: Point, distance: number): Point {
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    if (length === 0) return from;
    const t = distance / length;
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
}

/** Shape box = panel plus the beak protrusion on `side`. */
export function floatingShapeSize(
    panelWidth: number,
    panelHeight: number,
    side: FloatingBeakSide,
    beakHeight: number,
): { width: number; height: number } {
    const vertical = side === "top" || side === "bottom";
    return {
        width: vertical ? panelWidth : panelWidth + beakHeight,
        height: vertical ? panelHeight + beakHeight : panelHeight,
    };
}

/** Clamp the beak off the corner arcs; centered when the edge is too short. */
export function resolveBeakCenter(
    edgeLength: number,
    align: FloatingBeakAlign,
    beakWidth: number,
    radius: number,
    insetStart: number,
    insetEnd: number,
): number {
    const half = beakWidth / 2;
    const min = radius + half;
    const max = edgeLength - radius - half;
    if (max < min) return edgeLength / 2;
    const wanted =
        align === "center"
            ? edgeLength / 2
            : align === "start"
              ? insetStart + half
              : edgeLength - insetEnd - half;
    return Math.min(max, Math.max(min, wanted));
}

/** One closed path for panel + beak, in shape-box coordinates. */
export function buildFloatingOutline({
    panelWidth,
    panelHeight,
    radius,
    side,
    beakCenter,
    beakWidth,
    beakHeight,
    tipRadius,
    inset = 0,
}: FloatingOutlineInput): string {
    const offsetX = side === "left" ? beakHeight : 0;
    const offsetY = side === "top" ? beakHeight : 0;
    const x0 = offsetX + inset;
    const y0 = offsetY + inset;
    const x1 = offsetX + panelWidth - inset;
    const y1 = offsetY + panelHeight - inset;
    const r = Math.max(0, Math.min(radius - inset, (x1 - x0) / 2, (y1 - y0) / 2));

    const half = beakWidth / 2;
    const sinHalfAngle = half / Math.hypot(half, beakHeight);
    const reach = beakHeight + inset - inset / sinHalfAngle;
    const spread = (half * reach) / beakHeight;

    const edgeCenter = (side === "top" || side === "bottom" ? offsetX : offsetY) + beakCenter;

    const beak = (first: Point, tip: Point, second: Point): string => {
        const before = towards(tip, first, tipRadius);
        const after = towards(tip, second, tipRadius);
        return ` L ${pt(first)} L ${pt(before)} Q ${pt(tip)} ${pt(after)} L ${pt(second)}`;
    };

    let d = `M ${pt({ x: x0 + r, y: y0 })}`;
    if (side === "top") {
        d += beak(
            { x: edgeCenter - spread, y: y0 },
            { x: edgeCenter, y: y0 - reach },
            { x: edgeCenter + spread, y: y0 },
        );
    }
    d += ` L ${pt({ x: x1 - r, y: y0 })} A ${fmt(r)} ${fmt(r)} 0 0 1 ${pt({ x: x1, y: y0 + r })}`;
    if (side === "right") {
        d += beak(
            { x: x1, y: edgeCenter - spread },
            { x: x1 + reach, y: edgeCenter },
            { x: x1, y: edgeCenter + spread },
        );
    }
    d += ` L ${pt({ x: x1, y: y1 - r })} A ${fmt(r)} ${fmt(r)} 0 0 1 ${pt({ x: x1 - r, y: y1 })}`;
    if (side === "bottom") {
        d += beak(
            { x: edgeCenter + spread, y: y1 },
            { x: edgeCenter, y: y1 + reach },
            { x: edgeCenter - spread, y: y1 },
        );
    }
    d += ` L ${pt({ x: x0 + r, y: y1 })} A ${fmt(r)} ${fmt(r)} 0 0 1 ${pt({ x: x0, y: y1 - r })}`;
    if (side === "left") {
        d += beak(
            { x: x0, y: edgeCenter + spread },
            { x: x0 - reach, y: edgeCenter },
            { x: x0, y: edgeCenter - spread },
        );
    }
    d += ` L ${pt({ x: x0, y: y0 + r })} A ${fmt(r)} ${fmt(r)} 0 0 1 ${pt({ x: x0 + r, y: y0 })} Z`;
    return d;
}
