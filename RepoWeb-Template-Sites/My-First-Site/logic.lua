-- RepoWeb Template — Lua Script Demo
-- This file is executed by the Fengari Lua VM inside the sandboxed iframe.
-- The 'repoweb' global provides safe DOM access.

-- Display a greeting in the title
local title = repoweb:getElementById("app-title")
if title then
  local currentText = repoweb:getTextContent(title)
  repoweb:setTextContent(title, currentText .. " [Lua Active]")
  repoweb:setStyle(title, "font-size", "inherit")
end

-- Create a Lua attribution badge under the intro card
local introCard = repoweb:getElementById("intro-card")
if introCard then
  local badge = repoweb:createElement("div")
  repoweb:setStyle(badge, "margin-top", "1rem")
  repoweb:setStyle(badge, "padding", "0.5rem 0.75rem")
  repoweb:setStyle(badge, "background", "rgba(44, 45, 114, 0.3)")
  repoweb:setStyle(badge, "border-radius", "8px")
  repoweb:setStyle(badge, "font-size", "0.8rem")
  repoweb:setStyle(badge, "color", "#a5b4fc")
  repoweb:setStyle(badge, "text-align", "center")
  repoweb:setTextContent(badge, "This element was created by logic.lua via the Fengari Lua VM")
  repoweb:appendChild(introCard, badge)
end

-- Log to browser console
repoweb:log("RepoWeb Lua engine initialized successfully")
repoweb:log("Available APIs: getElementById, querySelector, createElement, etc.")
