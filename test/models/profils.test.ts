const { Profil } = require('../../src/models/profils');

const profil = new Profil({email: 'test@test.gmail', firstname: 'testfirst', lastname: 'testlast'})


describe('Profil functions', () => {
    it("renvoie le fisrtname du profil", () => {
        expect(profil.firstname).toBe("testfirst");
    })

    it("renvoie le lastname du profil", () => {
        expect(profil.lastname).toBe("testlast");
    })

    it("renvoie l'email du profil", () => {
        expect(profil.email).toBe("test@test.gmail");
    })

    // it("returns the status of the user", () => {
    //     expect(profil.status()).toBe("Je m'appelle Thomas");
    // })
//
    // it("renvoie l'age d'un utilateur", () => {
    //     expect(profil.age).toBe(0);
    // })
//
    // it("renvoie l'age incrémenté de l'utilisateur", () => {
    //     expect(profil.age).toBe(0);
    //     user.vieillir();
    //     expect(user.age).toBe(1);
    // })
})