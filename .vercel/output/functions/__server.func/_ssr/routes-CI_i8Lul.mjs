import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Play, c as Heart, d as CircleHelp, f as Bookmark, i as Signal, l as Download, o as Music, p as BatteryFull, r as Trash2, s as MessageCircle, t as Wifi, u as ClipboardPaste } from "../_libs/lucide-react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CI_i8Lul.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var useShelf = create()(persist((set) => ({
	items: [],
	prefer: "clean",
	remember: (clip) => set((state) => ({ items: [clip, ...state.items.filter((item) => item.id !== clip.id)].slice(0, 30) })),
	remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
	clear: () => set({ items: [] }),
	setPrefer: (prefer) => set({ prefer })
}), {
	name: "marq-shelf",
	skipHydration: true
}));
function MarqMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 5.5H10.5A5 5 0 0 0 5.5 10.5v11A5 5 0 0 0 10.5 26.5h11a5 5 0 0 0 5-5V20",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.4",
			strokeLinecap: "round"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M18.5 5.5H22a4.5 4.5 0 0 1 4.5 4.5v3.5",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.4",
			strokeLinecap: "round",
			opacity: "0.4"
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var resolveClip = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input !== "object" || input === null || !("url" in input) || typeof input.url !== "string") throw new Error("Paste a TikTok link.");
	return { url: input.url };
}).handler(createSsrRpc("bd495c49efc7ca92ab0eeaadb73eeec04b229ea67dbf71622b21f430caefa974"));
function isPhoto(clip) {
	return clip.images.length > 0 && clip.durationSec <= 0;
}
function variantUrl(clip, variant) {
	if (variant === "clean") return clip.withoutLogoUrl;
	return clip.withLogoUrl;
}
function availableVariant(clip, prefer) {
	if (prefer === "clean" && clip.withoutLogoUrl) return "clean";
	if (prefer === "logo" && clip.withLogoUrl) return "logo";
	if (clip.withoutLogoUrl) return "clean";
	return "logo";
}
function fileBase(clip) {
	return `marq-${(clip.authorHandle || "post").replace(/[^\w.-]+/g, "").slice(0, 40) || "post"}-${clip.id.replace(/[^\w.-]+/g, "").slice(0, 24) || "clip"}`;
}
function compactCount(n) {
	if (!Number.isFinite(n) || n < 0) return "0";
	if (n < 1e3) return String(Math.round(n));
	if (n < 1e6) {
		const value = n / 1e3;
		return `${(value < 10 ? value.toFixed(1) : value.toFixed(0)).replace(/\.0$/, "")}K`;
	}
	const value = n / 1e6;
	return `${value.toFixed(value < 10 ? 1 : 0).replace(/\.0$/, "")}M`;
}
function clock(sec) {
	const s = Math.max(0, Math.round(sec));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function ago(ts, now = Date.now()) {
	const min = Math.floor(Math.max(0, now - ts) / 6e4);
	if (min < 1) return "Just now";
	if (min < 60) return `${min}m ago`;
	const hr = Math.floor(min / 60);
	if (hr < 24) return `${hr}h ago`;
	return `${Math.floor(hr / 24)}d ago`;
}
function triggerDownload(blob, name) {
	const objectUrl = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = objectUrl;
	link.download = name;
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(objectUrl), 4e3);
}
async function blobFrom(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error("The file host refused the download.");
	const type = response.headers.get("content-type") || "";
	if (type.includes("text/html") || type.includes("application/json")) throw new Error("The file host refused the download.");
	return response.blob();
}
async function saveRemoteFile(url, name) {
	try {
		triggerDownload(await blobFrom(url), name);
		return;
	} catch {}
	const proxied = `/api/media?${new URLSearchParams({
		src: url,
		name
	})}`;
	const response = await fetch(proxied);
	if (!response.ok) {
		let message = "Couldn’t save that file. Try again.";
		try {
			const body = await response.json();
			if (body.error) message = body.error;
		} catch {}
		throw new Error(message);
	}
	triggerDownload(await response.blob(), name);
}
var SAMPLE = "https://www.tiktok.com/@scout2015/video/6718335390845095173";
function errorText(error) {
	if (error instanceof Error && error.message) return error.message.replace(/^Error:\s*/, "");
	return "Something went wrong. Try that link again.";
}
function SaveScreen({ launch }) {
	const setPrefer = useShelf((state) => state.setPrefer);
	const remember = useShelf((state) => state.remember);
	const [url, setUrl] = (0, import_react.useState)("");
	const [clip, setClip] = (0, import_react.useState)(null);
	const [variant, setVariant] = (0, import_react.useState)("clean");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	async function fetchUrl(next) {
		const preferNow = useShelf.getState().prefer;
		setBusy("fetch");
		setError("");
		setNotice("");
		try {
			const result = await resolveClip({ data: { url: next } });
			setClip(result);
			setVariant(availableVariant(result, preferNow));
			remember(result);
			setNotice("Saved to your shelf on this device.");
		} catch (err) {
			setError(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	(0, import_react.useEffect)(() => {
		if (!launch) return;
		const next = launch.slice(launch.indexOf("|") + 1);
		if (!next) return;
		setUrl(next);
		fetchUrl(next);
	}, [launch]);
	async function onSubmit(event) {
		event.preventDefault();
		await fetchUrl(url);
	}
	async function downloadChosen() {
		if (!clip) return;
		const fileUrl = variantUrl(clip, variant);
		if (!fileUrl) return;
		setBusy("file");
		setError("");
		try {
			const tag = variant === "clean" ? "no-logo" : "with-logo";
			await saveRemoteFile(fileUrl, `${fileBase(clip)}-${tag}.mp4`);
		} catch (err) {
			setError(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	async function downloadAudio() {
		if (!clip?.audioUrl) return;
		setBusy("audio");
		setError("");
		try {
			const ext = clip.audioUrl.includes("audio_mpeg") || clip.audioUrl.includes(".mp3") ? "mp3" : "m4a";
			await saveRemoteFile(clip.audioUrl, `${fileBase(clip)}-sound.${ext}`);
		} catch (err) {
			setError(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	async function downloadImage(imageUrl, index) {
		if (!clip) return;
		setBusy("file");
		setError("");
		try {
			await saveRemoteFile(imageUrl, `${fileBase(clip)}-photo-${index + 1}.jpg`);
		} catch (err) {
			setError(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	function choose(next) {
		setVariant(next);
		setPrefer(next);
	}
	const photo = clip ? isPhoto(clip) : false;
	const activeUrl = clip ? variantUrl(clip, variant) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 px-5 pt-2 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-copper uppercase",
				children: "Save"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display mt-1 text-4xl leading-none font-semibold text-fg",
				children: [
					"With the logo.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Or without."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "tiktok-url",
						className: "text-sm text-muted",
						children: "Public TikTok link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "tiktok-url",
							value: url,
							onChange: (event) => setUrl(event.target.value),
							placeholder: "https://www.tiktok.com/...",
							inputMode: "url",
							autoCapitalize: "off",
							autoCorrect: "off",
							spellCheck: false,
							className: "min-h-12 min-w-0 flex-1 rounded-2xl border border-line bg-surface px-4 text-base text-fg outline-none placeholder:text-faint focus:border-copper"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex min-h-12 min-w-12 items-center justify-center rounded-2xl bg-raised text-fg",
							"aria-label": "Paste link",
							onClick: () => {
								navigator.clipboard.readText().then((text) => {
									if (text) setUrl(text.trim());
								}).catch(() => {
									setError("Clipboard is blocked. Paste the link into the field.");
								});
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy === "fetch" || url.trim().length === 0,
						className: "min-h-12 rounded-2xl bg-copper text-base font-semibold text-on-copper disabled:opacity-50",
						children: busy === "fetch" ? "Reading the post…" : "Fetch post"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 text-sm font-medium text-muted underline decoration-line underline-offset-4",
						onClick: () => {
							setUrl(SAMPLE);
							fetchUrl(SAMPLE);
						},
						children: "Try a public sample"
					})
				]
			}),
			busy === "fetch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-full bg-raised",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "marq-sweep" })
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl bg-surface px-4 py-3 text-sm text-fg",
				role: "alert",
				children: error
			}) : null,
			clip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex flex-col gap-4 rounded-3xl bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [clip.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: clip.avatar,
							alt: "",
							className: "size-11 rounded-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-11 rounded-full bg-raised" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium text-fg",
								children: clip.authorName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm text-muted",
								children: ["@", clip.authorHandle]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-3 text-sm text-fg",
						children: clip.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted",
						children: [
							clip.durationSec > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: clock(clip.durationSec) }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }),
									" ",
									compactCount(clip.plays)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3.5" }),
									" ",
									compactCount(clip.likes)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-3.5" }),
									" ",
									compactCount(clip.comments)
								]
							})
						]
					}),
					photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoSet, {
						clip,
						busy: busy === "file",
						onSave: downloadImage
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoSet, {
						clip,
						variant,
						activeUrl,
						busy: busy === "file",
						onChoose: choose,
						onDownload: () => void downloadChosen()
					}),
					clip.audioUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy === "audio",
						onClick: () => void downloadAudio(),
						className: "flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-2xl bg-raised px-4 text-sm font-medium text-fg disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: busy === "audio" ? "Saving sound…" : clip.audioTitle ? `Save sound · ${clip.audioTitle}` : "Save sound"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: clip.sourceUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "text-center text-sm text-muted underline decoration-line underline-offset-4",
						children: "Open the original post"
					}),
					notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted",
						children: notice
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Paste a video or photo link. Marq asks for the files TikTok already published — one with the moving logo, and the clean one when it exists."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-faint",
				children: "Only save posts you’re allowed to keep. Private and friends-only posts won’t resolve."
			})
		]
	});
}
function VideoSet({ clip, variant, activeUrl, busy, onChoose, onDownload }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-1 rounded-2xl bg-ink p-1",
				role: "group",
				"aria-label": "Logo choice",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantButton, {
					label: "With logo",
					hint: "Stamped file",
					selected: variant === "logo",
					disabled: !clip.withLogoUrl,
					onClick: () => onChoose("logo")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantButton, {
					label: "Without logo",
					hint: "Clean file",
					selected: variant === "clean",
					disabled: !clip.withoutLogoUrl,
					onClick: () => onChoose("clean")
				})]
			}),
			!clip.withLogoUrl || !clip.withoutLogoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["This post only has one video file", clip.withoutLogoUrl ? " — the clean one, without the logo." : " — the one with the logo still on it."]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: variant === "clean" ? "Clean playback file. The moving TikTok logo is not burned in." : "The file TikTok stamps with its moving logo and username."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: !activeUrl || busy,
				onClick: onDownload,
				className: "min-h-12 rounded-2xl bg-copper text-base font-semibold text-on-copper disabled:opacity-50",
				children: busy ? "Preparing file…" : variant === "clean" ? "Download without logo" : "Download with logo"
			}),
			activeUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: activeUrl,
				poster: clip.cover || void 0,
				controls: true,
				playsInline: true,
				preload: "metadata",
				className: "max-h-72 w-full rounded-2xl bg-ink object-contain"
			}, activeUrl) : null
		]
	});
}
function VariantButton({ label, hint, selected, disabled, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		disabled,
		"aria-pressed": selected,
		onClick,
		className: selected ? "min-h-12 rounded-xl bg-copper px-2 text-on-copper disabled:opacity-40" : "min-h-12 rounded-xl px-2 text-fg disabled:opacity-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm font-semibold",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: selected ? "block text-xs opacity-80" : "block text-xs text-muted",
			children: hint
		})]
	});
}
function PhotoSet({ clip, busy, onSave }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: "Photo post. These slides don’t carry the moving logo."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: clip.images.length > 1 ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2",
			children: clip.images.map((image, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "overflow-hidden rounded-2xl bg-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: "marq-photo w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => onSave(image, index),
					className: "min-h-11 w-full text-sm font-medium text-fg disabled:opacity-50",
					children: clip.images.length > 1 ? `Save slide ${index + 1}` : "Download photo"
				})]
			}, image))
		})]
	});
}
function ShelfScreen({ hydrated, onOpen }) {
	const items = useShelf((state) => state.items);
	const remove = useShelf((state) => state.remove);
	const shown = hydrated ? items : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 px-5 pt-2 pb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-widest text-copper uppercase",
			children: "Shelf"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display mt-1 text-4xl leading-none font-semibold",
			children: "Recent posts"
		})] }), shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Nothing here yet. Fetch a link on Save and it stays on this device, ready to download again."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2",
			children: shown.map((clip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-stretch gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpen(clip),
					className: "flex min-h-16 min-w-0 flex-1 gap-3 rounded-2xl bg-surface p-2 text-left",
					children: [clip.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: clip.cover,
						alt: "",
						className: "h-16 w-12 rounded-xl object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-16 w-12 rounded-xl bg-raised" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "line-clamp-2 block text-sm font-medium",
							children: clip.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-xs text-muted",
							children: [
								"@",
								clip.authorHandle,
								" · ",
								ago(clip.fetchedAt)
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Remove ${clip.authorHandle}`,
					onClick: () => remove(clip.id),
					className: "inline-flex w-12 items-center justify-center rounded-2xl bg-surface text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}, clip.id))
		})]
	});
}
function AboutScreen() {
	const clear = useShelf((state) => state.clear);
	const count = useShelf((state) => state.items.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 px-5 pt-2 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-copper uppercase",
				children: "About"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-4xl leading-none font-semibold",
				children: "How Marq saves"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "flex flex-col gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-copper",
							children: "1 · Paste"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted",
							children: "A public video or photo link from TikTok, including short vm.tiktok.com links."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-copper",
							children: "2 · Choose"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted",
							children: "With logo keeps the moving TikTok mark. Without logo uses the clean playback file when the post has one."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-copper",
							children: "3 · Download"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted",
							children: "The file saves to your phone. Sound is separate, when the post has a track."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Photo posts come through as slides, not a logo choice. Lives, private posts, and friends-only posts can’t be fetched."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Your shelf stays in this browser only. Links expire, so opening an old row fetches the post again."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: count === 0,
				onClick: () => clear(),
				className: "min-h-12 rounded-2xl bg-raised text-sm font-medium text-fg disabled:opacity-40",
				children: ["Clear shelf", count > 0 ? ` · ${count}` : ""]
			})
		]
	});
}
function MarqApp() {
	const [tab, setTab] = (0, import_react.useState)("save");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [launch, setLaunch] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		Promise.resolve(useShelf.persist.rehydrate()).then(() => {
			if (live) setHydrated(true);
		});
		return () => {
			live = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-5 pt-1 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarqMark, { className: "size-7 text-copper" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl leading-none font-semibold tracking-tight",
					children: "Marq"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [
					tab === "save" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveScreen, { launch }) : null,
					tab === "shelf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShelfScreen, {
						hydrated,
						onOpen: (clip) => {
							setLaunch(`${Date.now()}|${clip.sourceUrl}`);
							setTab("save");
						}
					}) : null,
					tab === "about" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutScreen, {}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "border-t border-line bg-bg px-3 pt-2 pb-2",
				"aria-label": "Primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
							label: "Save",
							selected: tab === "save",
							onClick: () => setTab("save"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
							label: "Shelf",
							selected: tab === "shelf",
							onClick: () => setTab("shelf"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
							label: "About",
							selected: tab === "about",
							onClick: () => setTab("about"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-2 mb-1 h-1 w-28 rounded-full bg-line",
					"aria-hidden": "true"
				})]
			})
		]
	});
}
function StatusBar() {
	const [label, setLabel] = (0, import_react.useState)("\xA0");
	(0, import_react.useEffect)(() => {
		const tick = () => {
			setLabel((/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "numeric",
				minute: "2-digit"
			}));
		};
		tick();
		const id = window.setInterval(tick, 15e3);
		return () => window.clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between px-5 pt-3 text-xs text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-fg",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1.5",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signal, { className: "size-3.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-3.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatteryFull, { className: "size-4" })
			]
		})]
	});
}
function TabButton({ label, selected, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-current": selected ? "page" : void 0,
		className: "flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs font-medium",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: selected ? "inline-flex h-8 w-16 items-center justify-center rounded-full bg-copper text-on-copper" : "inline-flex h-8 w-16 items-center justify-center text-muted",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: selected ? "text-fg" : "text-muted",
			children: label
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "studio",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "studio-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-copper uppercase",
					children: "Phone app"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-3 text-6xl leading-none font-semibold",
					children: "Marq"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-lg text-muted",
					children: "Save a public TikTok. Keep the moving logo, or leave it off."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-8 flex flex-col gap-3 text-sm text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-copper",
								children: "01"
							}), "Paste a video or photo link."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-copper",
								children: "02"
							}), "Choose with logo or without."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-copper",
								children: "03"
							}), "Download the file, or just the sound."]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "phone",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarqApp, {})
		})]
	});
}
//#endregion
export { Home as component };
