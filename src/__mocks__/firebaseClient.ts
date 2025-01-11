export const auth = {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  };
  
  export const db = {
    collection: jest.fn(),
    doc: jest.fn(),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
  };
  