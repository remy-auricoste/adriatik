var messages = {
  select: {
    single: {
      Unit: "Veuillez sélectionner une unité",
      Territory: "Veuillez sélectionner un territoire",
      Player: "Veuillez sélectionner un joueur"
    },
    multi: {
      Unit: "Veuillez sélectionner un groupe d'unités"
    }
  },
  placement: "Veuillez placer vos troupes sur 2 territoires adjacents et vos flottes sur 2 territoires maritimes adjacents"
}


function messageGetter(key, object) {
  if (!object) {
    object = messages;
  }
  if (key.constructor === String) {
    key = key.split(".");
  }
  var result = object[key[0]];
  return key.length === 1 ? result : messageGetter(key.slice(1), result);
}

module.exports = messageGetter;
