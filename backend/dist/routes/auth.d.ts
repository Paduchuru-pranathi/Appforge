import { Request, Response, NextFunction } from 'express';
declare const router: import("express-serve-static-core").Router;
declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
export { authMiddleware };
export default router;
//# sourceMappingURL=auth.d.ts.map