
Game.EntityGenerator = new Game.Generator('entities',Game.Entity);


Game.EntityGenerator.learn({
	name: 'avatar',
	chr: '🐵',
	fg: '#dda',
	maxHp: 10,
	mixins: ["PlayerActor", "WalkerCorporeal", "Chronicle", "HitPoints", "MeleeAttacker", "Sight", "MapMemory"]
	// mixins: [Game.EntityMixin.PlayerActor,
	// 		 Game.EntityMixin.WalkerCorporeal,
	// 		 Game.EntityMixin.Chronicle,
	// 		 Game.EntityMixin.HitPoints,
	// 		 Game.EntityMixin.MeleeAttacker,
	// 		 Game.EntityMixin.Sight,
	// 		 Game.EntityMixin.MapMemory]

});

Game.EntityGenerator.learn({
	name: 'puppy',
	chr: 'p',
	fg: '#964b00',
	mixins: ["WalkerCorporeal", "Chronicle", "AvatarFollower"]
	// mixins: [Game.EntityMixin.WalkerCorporeal,
	// 	     Game.EntityMixin.Chronicle,
	// 	     Game.EntityMixin.AvatarFollower]
});

Game.EntityGenerator.learn({
	name: 'fungus',
	chr: '🌱',
	fg: '#228b22',
	maxHp: 2,
	mixins: ["HitPoints"]
	// mixins: [Game.EntityMixin.HitPoints]
});

Game.EntityGenerator.learn({
	name: 'jerry',
	chr: 'j',
	fg: '#00ffff',
	maxHp: 1,
	mixins: ["HitPoints", "PeacefulWanderActor", "WalkerCorporeal"]
	// mixins: [Game.EntityMixin.HitPoints,
	// 		 Game.EntityMixin.PeacefulWanderActor,
	// 		 Game.EntityMixin.WalkerCorporeal]
})
