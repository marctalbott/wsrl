
Game.EntityGenerator = new Game.Generator('entities',Game.Entity);


Game.EntityGenerator.learn({
	name: 'avatar',
	chr: '🐵',
	fg: '#dda',
	maxHp: 10,
	inventoryCapacity: 4,
	mixins: ["PlayerActor", "WalkerCorporeal", "Chronicle", "HitPoints", "MeleeAttacker", "Sight", "MapMemory", "InventoryHolder", "PlayerMessager"]
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
	name: 'demon',
	chr: 'd',
	fg: '#00ffff',
	maxHp: 1,
	mixins: ["HitPoints", "PeacefulWanderActor", "WalkerCorporeal"]
	// mixins: [Game.EntityMixin.HitPoints,
	// 		 Game.EntityMixin.PeacefulWanderActor,
	// 		 Game.EntityMixin.WalkerCorporeal]
});


Game.EntityGenerator.learn({
	name: 'binger',
	chr: 'b',
	fg: '#00ff00',
	maxHp: 3,
//	sightRadius: 3,
	mixins: ["HitPoints", "WalkerCorporeal", "EnemyWanderActor", "Sight"]
	// [Game.EntityMixin.HitPoints,
	// 		 Game.EntityMixin.WalkerCorporeal,
	// 		 //Game.EntityMixin.MeleeAttacker,
	// 		 Game.EntityMixin.EnemyWanderActor,
	// 		 Game.EntityMixin.Sight]
})
// >>>>>>> d48c9679f07f67ff92943b09bcc2cf019b5aa60c
