
Game.EntityGenerator = new Game.Generator('entities',Game.Entity);


Game.EntityGenerator.learn({
	name: 'avatar',
	chr: '@',
	fg: '#dda',
	maxHp: 10,
	mixins: [Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle, Game.EntityMixin.HitPoints, Game.EntityMixin.MeleeAttacker]

});

Game.EntityGenerator.learn({
	name: 'puppy',
	chr: 'p',
	fg: '#964b00',
	mixins: [Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle]
});

Game.EntityGenerator.learn({
	name: 'fungus',
	chr: 'f',
	fg: '#228b22',
	maxHp: 1,
	mixins: [Game.EntityMixin.HitPoints]
});
