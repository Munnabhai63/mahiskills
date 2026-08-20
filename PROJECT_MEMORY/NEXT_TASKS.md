# MAHI SKILLS — Next Priority Tasks & Action Items

## 1. Immediate Next Execution Tasks:
1. **Audit & Update Remaining Admin Sub-Pages for 100% Theme Consistency**:
   - `app/admin/courses/new/page.tsx` (Create Course Form)
   - `app/admin/coupons/page.tsx` (Coupons & Discounts Manager)
   - `app/admin/reviews/page.tsx` (Student Reviews Moderation)
   - `app/admin/certificates/page.tsx` (Certificates Registry)
   - `app/admin/blog/page.tsx` (Blog Articles CMS)
   - `app/admin/messages/page.tsx` (Inquiries & Contact Inbox)
2. **Audit Certificate Verification Page (`app/verify-certificate/[id]/page.tsx`)**:
   - Verify gold guilloche border, embossed seal, QR code, and print stylesheet in both Light & Dark modes.
3. **Audit Video Modal (`components/VideoModal.tsx`)**:
   - Verify backdrop, close button, title, and video controls.
4. **Final Verification**:
   - Run `npm run build` to ensure 0 TypeScript / compilation errors.
   - Run `npx tsx scripts/verify-all-flows.ts` to confirm 19/19 test suite passes.
