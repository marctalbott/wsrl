
Game.EntityGenerator = new Game.Generator('entities',Game.Entity);


Game.EntityGenerator.learn({
	name: 'avatar',
	chr: '@',
	fg: '#dda',
	maxHp: 10,
	mixins: [Game.EntityMixin.PlayerActor, 
			 Game.EntityMixin.WalkerCorporeal, 
			 Game.EntityMixin.Chronicle, 
			 Game.EntityMixin.HitPoints, 
			 Game.EntityMixin.MeleeAttacker,
			 Game.EntityMixin.Sight,
			 Game.EntityMixin.MapMemory]

});

Game.EntityGenerator.learn({
	name: 'puppy',
	chr: 'p',
	fg: '#964b00',
	mixins: [Game.EntityMixin.WalkerCorporeal, 
		     Game.EntityMixin.Chronicle, 
		     Game.EntityMixin.AvatarFollower]
});

Game.EntityGenerator.learn({
	name: 'fungus',
	chr: 'f',
	fg: '#228b22',
	maxHp: 1,
	mixins: [Game.EntityMixin.HitPoints]
});

Game.EntityGenerator.learn({
	name: 'jerry',
	chr: 'j',
	fg: '#00ffff',
	maxHp: 1,
	mixins: [Game.EntityMixin.HitPoints, 
			 Game.EntityMixin.PeacefulWanderActor, 
			 Game.EntityMixin.WalkerCorporeal]
})
