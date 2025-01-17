// Prototype WIP

import { ARM5E } from "../config.js";
import { ASPECTS } from "../constants/enchant-aspects.js";
import ArM5eActiveEffect from "../helpers/active-effects.js";
import { computeRawCastingTotal } from "../helpers/magic.js";
import { EchantmentExtension } from "../schemas/enchantmentSchema.js";
import { error, log } from "../tools.js";

class Activity {
  constructor(actor, type) {
    this.actor = actor;
    this.type = type;
  }

  validation(input) {
    log("false", "NO EXISTING VALIDATION ");
    return { valid: true, duration: 1, message: "No validation", waste: 0 };
  }

  async application() {}

  get template() {
    return "";
  }
}

class AgingActivity extends Activity {}

class ProgressActivity extends Activity {}

class BookActivity extends ProgressActivity {}

export class LabActivity extends Activity {
  constructor(lab, actor, type) {
    super(actor, type);
    this.lab = lab;
    this.labSpecTotal = 0;
    this.ownerActivityMod = 0;
  }

  static ActivityFactory(lab, type) {
    switch (type) {
      case "inventSpell":
      case "learnSpell":
        return new SpellActivity(lab, lab.system.owner.document, type);
      case "minorEnchantment":
        return new MinorEnchantment(lab, lab.system.owner.document);
      case "visExtraction":
        return new VisExtractionActivity(lab, lab.system.owner.document);
      case "longevityRitual":
        return new LongevityRitualActivity(lab, lab.system.owner.document);
      default:
        log(false, "Unknown activity");
    }
  }

  hasVisCost = false;

  activateListeners(html) {}

  async getDefaultData() {
    return await Item.create(
      {
        name: "New activity",
        type: "spell"
        // system:
      },
      { temporary: true }
    );
  }

  activityAchievement(input) {
    return null;
  }

  prepareData(input) {
    return input;
  }

  get activitySheet() {
    return "systems/arm5e/templates/lab-activities/noparams.html";
  }

  get labActivitySpec() {
    return { mod: 0, label: "" };
  }

  computeLabTotal(data, distractions) {
    return this._computeLabTotal(data, distractions);
  }

  _computeLabTotal(data, distractions) {
    let labTot = computeRawCastingTotal(data, this.actor);

    let total = labTot.total;
    labTot.label += `+ ${game.i18n.localize("arm5e.sheet.int")} (${
      this.actor.system.characteristics.int.value
    }) &#10`;
    total += this.actor.system.characteristics.int.value;
    let MTscore = this.actor.getAbilityStats("magicTheory").score;
    labTot.label += `+ ${game.i18n.localize("arm5e.skill.arcane.magicTheory")} (${MTscore}`;
    total += MTscore;
    if (this.modifiers.magicThSpecApply) {
      labTot.label += ` + 1`;
      total++;
    }
    labTot.label += `)&#10`;

    for (let [key, mod] of Object.entries(this.modifiers)) {
      if (key == "magicThSpecApply") continue;
      total += mod;
      if (mod != 0) {
        labTot.label += `+ ${game.i18n.localize("arm5e.lab.bonus." + key)} (${mod}) &#10`;
      }
    }

    // lab specialties
    let labSpec = this.lab.system.specialty[data.system.technique.value].bonus;
    this.labSpecTotal = labSpec;
    if (labSpec != 0) {
      total += labSpec;
      labTot.label += `+ ${game.i18n.localize("arm5e.sheet.speciality")} ${
        CONFIG.ARM5E.magic.arts[data.system.technique.value].short
      } (${labSpec}) &#10`;
    }
    labSpec = this.lab.system.specialty[data.system.form.value].bonus;
    this.labSpecTotal += labSpec;
    if (labSpec != 0) {
      total += labSpec;
      labTot.label += `+ ${game.i18n.localize("arm5e.sheet.speciality")} ${
        CONFIG.ARM5E.magic.arts[data.system.form.value].short
      } (${labSpec}) &#10`;
    }

    // activities specialties
    labSpec = this.labActivitySpec;

    if (labSpec.mod != 0) {
      this.labSpecTotal += labSpec.mod;
      total += labSpec.mod;
      labTot.label += labSpec.label;
    }

    // owner modifiers
    let effects = ArM5eActiveEffect.findAllActiveEffectsWithSubtypeFiltered(
      this.actor.effects,
      this.type
    );

    this.ownerActivityMod = 0;
    for (let e of effects) {
      for (let ch of e.changes) {
        this.ownerActivityMod += Number(ch.value);
      }
    }
    if (this.ownerActivityMod > 0) {
      total += this.ownerActivityMod;
      labTot.label += `+ ${game.i18n.localize("arm5e.lab.bonus.activity")} (${
        this.ownerActivityMod
      })&#10`;
    }

    let deficiencyDivider = 1;
    if (labTot.deficientTech && labTot.deficientForm) {
      deficiencyDivider = 4;
    } else if (labTot.deficientTech || labTot.deficientForm) {
      deficiencyDivider = 2;
    }
    if (deficiencyDivider > 1) {
      labTot.label += game.i18n.format("arm5e.lab.planning.msg.artDeficiency", {
        divisor: deficiencyDivider
      });
    }
    let coeff = CONFIG.ARM5E.activities.distractions[distractions ?? "none"].coeff;
    if (coeff != 1) {
      labTot.label += `* ${coeff.toFixed(2)} (${game.i18n.localize(
        "arm5e.lab.distraction.label"
      )})&#10`;
    }

    return { score: Math.round((total / deficiencyDivider) * coeff), label: labTot.label };
  }
}

export class SpellActivity extends LabActivity {
  constructor(lab, actor, type) {
    super(lab, actor, type);
  }

  async getDefaultData() {
    const effect = await Item.create(
      {
        name: "New spell",
        type: "spell"
        // system:
      },
      { temporary: true }
    );
    return effect.toObject();
  }

  get activitySheet() {
    return "systems/arm5e/templates/lab-activities/spell.html";
  }

  validation(input) {
    if ("inventSpell" == this.type) {
      return this._validateInvention(input);
    } else {
      return this._validateSpellLearning(input);
    }
  }

  _validateInvention(planning) {
    let lvl = planning.data.system.level;
    let delta = planning.labTotal.score - lvl;
    if (delta < 1) {
      return {
        valid: false,
        waste: delta,
        duration: 0,
        message: game.i18n.localize("arm5e.lab.planning.msg.notSkilledInvent")
      };
    } else if (delta >= lvl) {
      return { valid: true, waste: delta - lvl, duration: 1, message: "" };
    } else {
      let dur = Math.ceil(lvl / delta);
      return {
        valid: true,
        waste: (delta * dur) % lvl,
        duration: dur,
        message: ""
      };
    }
  }
  _validateSpellLearning(planning) {
    let delta = planning.labTotal.score - planning.data.system.level;
    if (delta < 0) {
      return {
        valid: false,
        waste: delta,
        duration: 0,
        message: game.i18n.localize("arm5e.lab.planning.msg.notSkilledLearn")
      };
    }

    return { valid: true, waste: delta, duration: 1, message: "" };
  }

  get labActivitySpec() {
    if ("inventSpell" == this.type) {
      return {
        mod: this.lab.system.specialty.spells.bonus,
        label: `+ ${game.i18n.localize("arm5e.sheet.speciality")} ${game.i18n.localize(
          "arm5e.lab.specialty.spells"
        )} (${this.lab.system.specialty.spells.bonus}) &#10`
      };
    } else {
      return {
        mod: this.lab.system.specialty.texts.bonus,
        label: `+ ${game.i18n.localize("arm5e.sheet.speciality")} ${game.i18n.localize(
          "arm5e.lab.specialty.texts"
        )} (${this.lab.system.specialty.texts.bonus}) &#10`
      };
    }
  }
}

export class LongevityRitualActivity extends LabActivity {
  constructor(lab, actor, target) {
    super(lab, actor, "longevityRitual");
    this.target = target ?? actor;
  }

  // hasVisCost = true;

  get labActivitySpec() {
    return {
      mod: this.lab.system.specialty.longevityRituals.bonus,
      label: `+ ${game.i18n.localize("arm5e.sheet.speciality")} ${game.i18n.localize(
        "arm5e.lab.specialty.longevityRituals"
      )} (${this.lab.system.specialty.longevityRituals.bonus}) &#10`
    };
  }
  validation(input) {
    let isValid = true;
    let msg = game.i18n.format("arm5e.lab.planning.msg.longevityBonus", {
      bonus: Math.ceil(input.labTotal.score / 5)
    });

    return {
      valid: isValid,
      waste: 0,
      duration: 1,
      message: msg
    };
  }

  getVisCost(input) {
    return {
      amount: Math.ceil(input.labTotal.score / 10),
      technique: "cr",
      form: "co"
    };
  }
  async application() {}
}

export class VisExtractionActivity extends LabActivity {
  constructor(lab, actor) {
    super(lab, actor, "visExtraction");
  }

  get labActivitySpec() {
    return {
      mod: this.lab.system.specialty.visExtraction.bonus,
      label: `+ ${game.i18n.localize("arm5e.sheet.speciality")} ${game.i18n.localize(
        "arm5e.lab.specialty.visExtraction"
      )} (${this.lab.system.specialty.visExtraction.bonus}) &#10`
    };
  }

  activityAchievement(input) {
    return {
      name: "Vim vis",
      type: "vis",
      system: {
        art: "vi",
        pawns: Math.ceil(input.labTotal.score / 10),
        description: game.i18n.format("arm5e.lab.planning.msg.visExtracted2", {
          covenant: this.actor.system.covenant.value
        })
      }
    };
  }

  validation(input) {
    let isValid = true;
    let msg = game.i18n.format("arm5e.lab.planning.msg.visExtracted", {
      num: Math.ceil(input.labTotal.score / 10)
    });
    if (input.modifiers.aura == 0) {
      msg = game.i18n.localize("arm5e.lab.planning.msg.visExtracted3");
      isValid = false;
    }
    return {
      valid: isValid,
      waste: 0,
      duration: 1,
      message: msg
    };
  }
  async application() {}
}

export class MinorEnchantment extends LabActivity {
  constructor(lab, actor) {
    super(lab, actor, "minorEnchantment");
  }

  // hasVisCost = true;

  computeLabTotal(data, distractions) {
    return this._computeLabTotal(data.enchantment, distractions);
  }
  async getDefaultData() {
    const result = {};
    let enchant = await Item.create(
      {
        name: "New enchantment",
        type: "enchantment"
      },
      { temporary: true }
    );
    enchant = enchant.toObject();

    let item = await Item.create(
      {
        name: "Lesser enchanted device",
        type: "item",
        system: {
          quantity: 1,
          weight: 0,
          state: "appraised",
          enchantments: new EchantmentExtension()
        }
      },
      { temporary: true }
    );
    item = item.toObject();
    // item.system.receptacle = {
    //   capacity: { materialBase: "base1", sizeMultiplier: "tiny", desc: "" },
    //   aspect: { aspect: first, effect: firstEffect, bonus: 0, attuned: false, apply: false }
    // };
    const first = Object.keys(ASPECTS)[0];
    const firstEffect = Object.keys(ASPECTS[first].effects)[0];
    item.system.enchantments.capacities = [
      { materialBase: "base1", sizeMultiplier: "tiny", desc: "" }
    ];
    item.system.enchantments.aspects = [
      { aspect: first, effect: firstEffect, bonus: 0, attuned: false, apply: false }
    ];
    result.receptacle = item;
    result.enchantment = enchant;
    result.ASPECTS = ASPECTS;
    return result;
  }
  get labActivitySpec() {
    return {
      mod: this.lab.system.specialty.items.bonus,
      label: `+ ${game.i18n.localize("arm5e.sheet.speciality")} ${game.i18n.localize(
        "arm5e.lab.specialty.items"
      )} (${this.lab.system.specialty.items.bonus}) &#10`
    };
  }

  get activitySheet() {
    return "systems/arm5e/templates/lab-activities/minor-enchantment.html";
  }

  /**
   * Enrich context with specific data for the lab activity
   * @param {any} input
   * @returns {any}
   */
  prepareData(input) {
    const receptacleEnchants = input.planning.data.receptacle.system.enchantments;
    if (receptacleEnchants.aspects.length == 0) {
      error(false, `DEBUG prepareData: WARNING ASPECTS length = 0`);
      const first = Object.keys(ASPECTS)[0];
      const firstEffect = Object.keys(ASPECTS[first].effects)[0];
      receptacleEnchants.aspects = [
        { aspect: first, effect: firstEffect, bonus: 0, attuned: false, apply: false }
      ];
    } else {
      receptacleEnchants.aspects[0].effects = ASPECTS[receptacleEnchants.aspects[0].aspect].effects;

      receptacleEnchants.aspects[0].bonus =
        ASPECTS[receptacleEnchants.aspects[0].aspect].effects[
          receptacleEnchants.aspects[0].effect
        ]?.bonus;
    }

    receptacleEnchants.capacities[0].total =
      ARM5E.lab.enchantment.materialBase[receptacleEnchants.capacities[0].materialBase].base *
      ARM5E.lab.enchantment.sizeMultiplier[receptacleEnchants.capacities[0].sizeMultiplier].mult;
    input.planning.enchantPrefix = input.planning.namePrefix + "enchantment.";
    return input;
  }

  validation(input) {
    let lvl = input.data.enchantment.system.level;
    let delta = input.labTotal.score - lvl;
    if (delta < lvl) {
      return {
        valid: false,
        waste: delta,
        duration: 0,
        message: game.i18n.localize("arm5e.lab.planning.msg.notSkilledEnchant")
      };
    } else if (input.data.receptacle.system.enchantments.capacities[0].total * 10 < lvl) {
      return {
        valid: false,
        waste: delta,
        duration: 0,
        message: game.i18n.localize("arm5e.lab.planning.msg.smallCapacity")
      };
    } else {
      return {
        valid: true,
        waste: delta - lvl,
        duration: 1,
        message: game.i18n.format("arm5e.lab.planning.msg.visNeeded", {
          num: Math.ceil(lvl / 10)
        })
      };
    }
  }

  getVisCost(input) {
    return {
      amount: Math.ceil(input.data.enchantment.system.level / 10),
      technique: input.data.enchantment.system.technique.value,
      form: input.data.enchantment.system.form.value
    };
  }

  // TODO rework
  activityAchievement(input) {
    const item = input.data.receptacle;
    const achievement = {
      name: item.name,
      type: "item",
      img: item.img,
      system: {
        quantity: 1,
        state: "enchanted",
        weight: item.system.weight,
        description: item.system.description
      },
      _id: null
    };

    if (item._id) {
      // This is an existing item that need to be updated
      achievement._id = item._id;
    }
    const effect = input.data.enchantment;
    const enchantments = {
      author: this.actor.name,
      talisman: false,
      charged: false,
      prepared: false,
      locked: true,
      year: input.date.year,
      season: input.date.season,
      bonuses: [],
      aspects: item.system.enchantments.aspects,
      capacities: item.system.enchantments.capacities,
      effects: [effect]
    };
    achievement.system.enchantments = enchantments;
    return achievement;
  }

  activateListeners(html) {
    html.find(".aspect-change").change(async (e) => {
      let planning = this.lab.getFlag(ARM5E.SYSTEM_ID, "planning");
      let aspect = planning.data.receptacle.system.enchantments.aspects[0];
      let newAspect = e.currentTarget.selectedOptions[0].value;
      const effect = Object.keys(ASPECTS[newAspect].effects)[0];
      aspect.aspect = newAspect;
      aspect.effect = effect;
      aspect.bonus = ASPECTS[newAspect].effects[effect].bonus;
      aspect.effects = ASPECTS[newAspect].effects;
      await this.lab.setFlag(ARM5E.SYSTEM_ID, "planning", planning);
    });
  }
}
