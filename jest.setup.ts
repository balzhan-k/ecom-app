import * as React from "react";
import "@testing-library/jest-dom";

if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (typeof global.Response === "undefined") {
  global.Response = class MockResponse {
    ok: boolean;
    status: number;
    _body: any;

    constructor(body: any = "", init: any = {}) {
      this.ok = init.status ? init.status >= 200 && init.status < 300 : true;
      this.status = init.status || 200;
      this._body = body;
    }

    json() {
      try {
        return Promise.resolve(JSON.parse(this._body));
      } catch (e) {
        return Promise.resolve({});
      }
    }

    text() {
      return Promise.resolve(this._body);
    }

    static error() {
      return new MockResponse("", { status: 400 });
    }
    static json(data: any, init?: ResponseInit) {
      return new MockResponse(JSON.stringify(data), {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
      });
    }
    static redirect(url: string | URL, status?: number) {
      return new MockResponse("", {
        status: status || 302,
        headers: { Location: url.toString() },
      });
    }
  } as any;
}

global.fetch = jest.fn((url: any, init?: any) =>
  Promise.resolve(
    new (global.Response as any)(
      JSON.stringify({ url: "http://example.com/new-image.jpg" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  )
);

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return React.createElement("img", { ...props });
  },
}));

jest.mock("./src/lib/firebase", () => ({
  initializeApp: jest.fn(),
  getFirestore: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: "http://test.com/photo.jpg",
    },
    onAuthStateChanged: jest.fn((callback) => {
      callback({
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "http://test.com/photo.jpg",
      });
      return jest.fn(); 
    }),
    signOut: jest.fn(() => Promise.resolve()),
    signInWithPopup: jest.fn(() =>
      Promise.resolve({
        user: {
          uid: "test-uid",
          email: "test@example.com",
          displayName: "Test User",
          photoURL: "http://test.com/photo.jpg",
        },
      })
    ),
  })),
  GoogleAuthProvider: jest.fn(() => ({
    addScope: jest.fn(),
  })),
  db: {}, 
  auth: {}, 
  googleProvider: {}, 
}));
