Game.ALL_ENTITIES = {};

Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
	name: 'avatar',
	chr: '@',
	fg: '#dda',
	mixins: [Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle, Game.EntityMixin.HitPoints]
};

Game.EntityTemplates.Puppy = {
	name: 'puppy',
	chr: 'p',
	fg: '#964b00',
	mixins: [Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle]
};

Game.EntityTemplates.Fungus = {
	name: 'fungus',
	chr: 'f',
	fg: '#228b22',
	mixins: []
}
