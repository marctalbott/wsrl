
Game.EntityGenerator = new Game.Generator('entities',Game.Entity);


Game.EntityGenerator.learn('avatar', {
	name: 'avatar',
	chr: '@',
	fg: '#dda',
	mixins: [Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle, Game.EntityMixin.HitPoints]

});

Game.EntityGenerator.learn('puppy', {
	name: 'puppy',
	chr: 'p',
	fg: '#964b00',
	mixins: [Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle]
});

Game.EntityGenerator.learn('fungus', {
	name: 'fungus',
	chr: 'f',
	fg: '#228b22',
	mixins: [Game.EntityMixin.HitPoints]
});
