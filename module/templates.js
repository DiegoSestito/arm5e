/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const ArM5ePreloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor Sheet Partials
    "systems/arm5e/templates/actor/parts/actor-characteristics.html",
    "systems/arm5e/templates/actor/parts/actor-fatigue.html",
    "systems/arm5e/templates/actor/parts/actor-description.html",
    "systems/arm5e/templates/actor/parts/actor-abilities.html",
    "systems/arm5e/templates/actor/parts/actor-arts.html",
    "systems/arm5e/templates/actor/parts/actor-inventory.html",
    "systems/arm5e/templates/actor/parts/actor-combat.html",
    "systems/arm5e/templates/actor/parts/actor-virtuesFlaws.html",
    "systems/arm5e/templates/actor/parts/actor-familiar.html",
    "systems/arm5e/templates/actor/parts/actor-laboratory.html",
    "systems/arm5e/templates/actor/parts/actor-laboratoryTotals.html",
    "systems/arm5e/templates/actor/parts/actor-castingTotals.html",
    "systems/arm5e/templates/actor/parts/actor-voice-and-gestures.html",
    "systems/arm5e/templates/actor/parts/actor-diary.html",

    "systems/arm5e/templates/actor/parts/actor-profiles.html",
    "systems/arm5e/templates/actor/parts/actor-magic-attributes.html",

    "systems/arm5e/templates/actor/parts/codex-base-effects.hbs",
    "systems/arm5e/templates/actor/parts/codex-magical-effects.hbs",
    "systems/arm5e/templates/actor/parts/codex-enchantments.hbs",
    "systems/arm5e/templates/actor/parts/codex-spells.hbs",
    "systems/arm5e/templates/actor/parts/actor-weapons.html",
    "systems/arm5e/templates/actor/parts/actor-armor.html",
    "systems/arm5e/templates/actor/parts/actor-items.html",

    "systems/arm5e/templates/actor/parts/actor-vis.html",

    "systems/arm5e/templates/actor/parts/actor-attributesLaboratory.html",
    "systems/arm5e/templates/actor/parts/actor-inventoryLaboratory.html",
    "systems/arm5e/templates/actor/parts/actor-lab-workbench.html",

    "systems/arm5e/templates/actor/parts/actor-covenantAttributes.html",
    "systems/arm5e/templates/actor/parts/actor-covenantHabitants.html",
    "systems/arm5e/templates/actor/parts/actor-covenantPosessions.html",
    "systems/arm5e/templates/actor/parts/actor-covenantEconomics.html",
    "systems/arm5e/templates/actor/parts/actor-library.html",
    "systems/arm5e/templates/actor/parts/actor-covenantCalendar.html",
    "systems/arm5e/templates/actor/parts/hermeticFilter.hbs",
    "systems/arm5e/templates/actor/parts/topicFilter.hbs",
    "systems/arm5e/templates/actor/parts/timeFilter.hbs",

    "systems/arm5e/templates/actor/parts/crucible-magic-item.html",
    "systems/arm5e/templates/actor/parts/crucible-enchantment.html",
    // Item Sheet Partials
    "systems/arm5e/templates/item/parts/spell-design.html",
    "systems/arm5e/templates/item/parts/spell-design-V2.html",
    "systems/arm5e/templates/item/parts/enchantment-attributes.html",
    "systems/arm5e/templates/item/parts/enchant-extension.html",
    // "systems/arm5e/templates/item/parts/item-enchantment.html",
    "systems/arm5e/templates/item/parts/magic-item.html",
    // "systems/arm5e/templates/item/parts/item-magic-item.html",
    "systems/arm5e/templates/item/parts/authorship.html",
    "systems/arm5e/templates/item/parts/seasonal-activity.html",
    "systems/arm5e/templates/item/parts/item-header.html",
    "systems/arm5e/templates/item/parts/item-footer.html",
    "systems/arm5e/templates/item/parts/item-thin-header.html",
    "systems/arm5e/templates/item/parts/item-thin-footer.html",
    "systems/arm5e/templates/item/parts/activities.html",

    // Item sheets
    "systems/arm5e/templates/item/item-ability-sheet.html",
    "systems/arm5e/templates/item/item-abilityFamiliar-sheet.html",
    "systems/arm5e/templates/item/item-armor-sheet.html",
    "systems/arm5e/templates/item/item-baseEffect-sheet.html",
    "systems/arm5e/templates/item/item-book-sheet.html",
    "systems/arm5e/templates/item/item-calendarCovenant-sheet.html",
    "systems/arm5e/templates/item/item-diaryEntry-sheet.html",
    "systems/arm5e/templates/item/item-distinctive-sheet.html",
    "systems/arm5e/templates/item/item-enchantment-sheet.html",
    "systems/arm5e/templates/item/item-flaw-sheet.html",
    "systems/arm5e/templates/item/item-habitantCompanion-sheet.html",
    "systems/arm5e/templates/item/item-habitantHabitants-sheet.html",
    "systems/arm5e/templates/item/item-habitantHorses-sheet.html",
    "systems/arm5e/templates/item/item-habitantLivestock-sheet.html",
    "systems/arm5e/templates/item/item-habitantMagi-sheet.html",
    "systems/arm5e/templates/item/item-habitantSpecialists-sheet.html",
    "systems/arm5e/templates/item/item-incomingSource-sheet.html",
    "systems/arm5e/templates/item/item-item-sheet.html",
    "systems/arm5e/templates/item/item-labCovenant-sheet.html",
    "systems/arm5e/templates/item/item-laboratoryText-sheet.html",
    "systems/arm5e/templates/item/item-magicalEffect-sheet.html",
    "systems/arm5e/templates/item/item-magicItem-sheet.html",
    "systems/arm5e/templates/item/item-personalityTrait-sheet.html",
    "systems/arm5e/templates/item/item-possessionsCovenant-sheet.html",
    "systems/arm5e/templates/item/item-power-sheet.html",
    "systems/arm5e/templates/item/item-powerFamiliar-sheet.html",
    "systems/arm5e/templates/item/item-reputation-sheet.html",
    "systems/arm5e/templates/item/item-sanctumRoom-sheet.html",
    "systems/arm5e/templates/item/item-speciality-sheet.html",
    "systems/arm5e/templates/item/item-spell-sheet.html",
    "systems/arm5e/templates/item/item-virtue-sheet.html",
    "systems/arm5e/templates/item/item-vis-sheet.html",
    "systems/arm5e/templates/item/item-visSourcesCovenant-sheet.html",
    "systems/arm5e/templates/item/item-visStockCovenant-sheet.html",
    "systems/arm5e/templates/item/item-weapon-sheet.html",
    "systems/arm5e/templates/item/item-wound-sheet.html",

    // Lab activity
    "systems/arm5e/templates/lab-activities/noparams.html",
    "systems/arm5e/templates/lab-activities/spell.html",
    "systems/arm5e/templates/lab-activities/minor-enchantment.html",
    // Rolls partials
    "systems/arm5e/templates/roll/parts/roll-header.html",
    "systems/arm5e/templates/roll/parts/roll-footer.html",
    "systems/arm5e/templates/roll/parts/penetration-options.html",
    // generic partials
    "systems/arm5e/templates/generic/active-effects.html",
    "systems/arm5e/templates/generic/calendar-grid.html",
    "systems/arm5e/templates/generic/group-schedule-grid.html",
    "systems/arm5e/templates/generic/schedule-grid.html",
    "systems/arm5e/templates/generic/simpleListPicker.html",
    "systems/arm5e/templates/generic/textInput.html",
    "systems/arm5e/templates/generic/numberInput.html",
    "systems/arm5e/templates/generic/auraInput.html",
    "systems/arm5e/templates/generic/agingPointsEdit.html",
    "systems/arm5e/templates/generic/largeDialog-footer.html",
    "systems/arm5e/templates/generic/largeDialog-header.html",
    "systems/arm5e/templates/generic/source.html",
    "systems/arm5e/templates/generic/aging-dialog.html",
    "systems/arm5e/templates/generic/metalic-bar.html",
    "systems/arm5e/templates/generic/simpleFieldBacksection.html",
    "systems/arm5e/templates/generic/quick-combat.html",
    "systems/arm5e/templates/generic/quick-magic.html",
    "systems/arm5e/templates/generic/quick-vitals.html",
    "systems/arm5e/templates/generic/vis-study.html",
    "systems/arm5e/templates/generic/confirmation.html"
  ]);
};
