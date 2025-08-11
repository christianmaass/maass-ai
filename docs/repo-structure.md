.
├── .DS_Store
├── .dependency-cruiser.js
├── .env.example
├── .env.local
├── .env.local.example
├── .eslintrc.json
├── .github
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── SECURITY.md
│   ├── dependabot.yml
│   ├── release-drafter.yml
│   └── workflows
│       ├── ci.yml
│       ├── release-drafter.yml
│       └── secret-scan.yml
├── .gitignore
├── .gitleaks.toml
├── .husky
│   ├── _
│   │   ├── .gitignore
│   │   ├── applypatch-msg
│   │   ├── commit-msg
│   │   ├── h
│   │   ├── husky.sh
│   │   ├── post-applypatch
│   │   ├── post-checkout
│   │   ├── post-commit
│   │   ├── post-merge
│   │   ├── post-rewrite
│   │   ├── pre-applypatch
│   │   ├── pre-auto-gc
│   │   ├── pre-commit
│   │   ├── pre-merge-commit
│   │   ├── pre-push
│   │   ├── pre-rebase
│   │   └── prepare-commit-msg
│   ├── commit-msg
│   └── pre-commit
├── .lintstagedrc.json
├── .prettierrc
├── CONTRIBUTING.md
├── README.md
├── REFACTORING_DOCUMENTATION.md
├── STYLEGUIDE.md
├── adapters
│   └── module-adapters.ts
├── api
├── archive
│   ├── .DS_Store
│   ├── api
│   │   └── openai-proxy.js
│   ├── pages
│   │   ├── api
│   │   │   └── debug
│   │   ├── debug-courses-api.tsx
│   │   ├── debug-enrollment-direct.tsx
│   │   ├── debug-enrollment-table.tsx
│   │   ├── debug-tables.tsx
│   │   ├── debug-user-guard-status.tsx
│   │   └── debug-user-status.tsx
│   ├── scripts
│   │   ├── analyze-case-type-table.js
│   │   ├── analyze-foundation-cases.js
│   │   ├── api-testing.js
│   │   ├── comprehensive-table-analysis.js
│   │   ├── execute-migration.js
│   │   ├── import-all-foundation-cases.js
│   │   ├── make-admin.js
│   │   ├── match-case-types-properly.js
│   │   ├── quick-wp-a1-test.js
│   │   ├── run-module-migration.js
│   │   ├── run-step-migration.js
│   │   ├── test-courses-api.js
│   │   ├── test-multi-course-migration.js
│   │   ├── test-openai-api.js
│   │   ├── test-wp-a1.js
│   │   ├── update-full-case-descriptions.js
│   │   └── update-step-titles.js
│   ├── sql
│   │   ├── debug
│   │   │   ├── check-enrollments-direct.sql
│   │   │   ├── check-profile-data.sql
│   │   │   ├── check-user-status.sql
│   │   │   └── fix-onboarding-status.sql
│   │   ├── manual-migration.sql
│   │   └── migrate-remove-name.sql
│   ├── sql-archive
│   │   ├── supabase-add-first-last-name.sql
│   │   ├── supabase-final-fix.sql
│   │   ├── supabase-fix-critical-errors-corrected.sql
│   │   ├── supabase-fix-critical-errors.sql
│   │   ├── supabase-fix-simple.sql
│   │   ├── supabase-role-system.sql
│   │   ├── supabase-setup.sql
│   │   ├── supabase-trigger-definitive.sql
│   │   └── supabase-trigger-repair.sql
│   └── sql-backup-20250725-215035
│       ├── ARBEITSPAKET_1_SCHEMA_AUDIT.sql
│       ├── ARBEITSPAKET_2_USER_PROFILES_FIX.sql
│       ├── ARBEITSPAKET_3_USER_TARIFF_VIEW.sql
│       ├── ARBEITSPAKET_4_FINALE_VERIFIKATION.sql
│       ├── ARBEITSPAKET_4_FINAL_TEST.sql
│       ├── CHECK_ASSESSMENTS_SCHEMA.sql
│       ├── CLEAN_SESSION_FIX.sql
│       ├── DEEP_ASSESSMENTS_DIAGNOSIS.sql
│       ├── DEFINITIVE_DATABASE_MIGRATION.sql
│       ├── DEFINITIVE_DATABASE_MIGRATION_CORRECTED.sql
│       ├── EXECUTE_THIS.sql
│       ├── FINAL_SAFE_MIGRATION.sql
│       ├── FIX_ASSESSMENTS_PERMISSIONS.sql
│       ├── FIX_ASSESSMENTS_RLS.sql
│       ├── FIX_RLS_INFINITE_RECURSION.sql
│       ├── FORCE_ASSESSMENTS_PERMISSIONS.sql
│       ├── QUERY_1_USER_PROFILES.sql
│       ├── QUERY_2_TABLES_CHECK.sql
│       ├── QUERY_3_TARIFF_PLANS.sql
│       ├── RADICAL_ASSESSMENTS_FIX.sql
│       ├── RADICAL_RLS_FIX.sql
│       ├── SAFE_MIGRATION.sql
│       ├── SESSION_CLEANUP.sql
│       ├── SIMPLE_ASSESSMENTS_CHECK.sql
│       ├── SIMPLE_TEST_1.sql
│       ├── SIMPLE_TEST_2.sql
│       ├── SIMPLE_TEST_3.sql
│       ├── TEST_ASSESSMENTS_ACCESS.sql
│       ├── check-existing-tables.sql
│       ├── create-missing-tables.sql
│       ├── fix-cases-table.sql
│       └── insert-case-types.sql
├── commitlint.config.cjs
├── components
│   ├── .DS_Store
│   ├── ConditionalModuleRenderer.tsx
│   ├── ContentModuleComponent.tsx
│   ├── DecisionMatrixComponent.tsx
│   ├── FreeTextWithFeedbackComponent.tsx
│   ├── LoginPage.tsx
│   ├── ModuleConfigurationPanel.tsx
│   ├── MultipleChoiceComponent.tsx
│   ├── SimpleTextInputComponent.tsx
│   ├── StepConfigurationSection.tsx
│   ├── VoiceInputComponent.tsx
│   ├── admin
│   │   ├── AdminHeader.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── LogDashboard.tsx
│   │   └── UserManagement.tsx
│   ├── courses
│   │   ├── CourseCard.tsx
│   │   ├── CourseGrid.tsx
│   │   ├── CourseTemplate.tsx
│   │   ├── ModuleCard.tsx
│   │   └── ModuleGrid.tsx
│   ├── dashboard
│   │   ├── DashboardCourseSection.tsx
│   │   └── WelcomeSection.tsx
│   ├── features
│   │   ├── AdminPanel.tsx
│   │   ├── AssessmentDisplay.tsx
│   │   ├── CaseDisplay.tsx
│   │   ├── CaseWorkflow.tsx
│   │   ├── CasesList.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Describtion_Case_Start.tsx
│   │   ├── ResponseInput.tsx
│   │   └── TextRatingForm.tsx
│   ├── foundation
│   │   ├── CaseCard.tsx
│   │   ├── CaseContent.tsx
│   │   ├── FoundationLayout.tsx
│   │   └── ResponseHandler.tsx
│   ├── foundation-cases
│   │   ├── CompletionScreen.tsx
│   │   ├── FoundationCaseContainer.tsx
│   │   └── FoundationStep.tsx
│   ├── foundation-manager
│   │   ├── CaseEditor.tsx
│   │   ├── CaseSelector.tsx
│   │   ├── StepRenderer.tsx
│   │   └── hooks
│   │       ├── useCaseGeneration.tsx
│   │       ├── useFoundationCases.tsx
│   │       └── useModuleState.tsx
│   ├── sections
│   │   ├── ContentSections.tsx
│   │   ├── CredentialsSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── MetricsSection.tsx
│   │   └── WelcomeHeroBanner.tsx
│   ├── settings
│   │   ├── AccountSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── ProfileSection.tsx
│   │   ├── SettingsHeader.tsx
│   │   ├── SettingsLayout.tsx
│   │   └── SettingsSidebar.tsx
│   ├── shared
│   │   ├── .DS_Store
│   │   ├── case-engine
│   │   │   ├── CaseEngine.tsx
│   │   │   └── types
│   │   ├── onboarding
│   │   │   └── OnboardingContainer.tsx
│   │   └── step-engine
│   │       ├── StepEngine.tsx
│   │       └── types
│   ├── tracks
│   │   └── strategy
│   │       ├── foundation-track
│   │       ├── onboarding
│   │       └── personalized-cases
│   └── ui
│       ├── AuthModal.tsx
│       ├── BewertungsBox.tsx
│       ├── ImpressumOverlay.tsx
│       ├── LoginModal.tsx
│       ├── Panel.tsx
│       ├── RegisterModal.tsx
│       ├── ResultCard.tsx
│       ├── StickyCTA.tsx
│       ├── TextBlick.tsx
│       ├── Textblock.tsx
│       ├── Typography.tsx
│       ├── UnifiedGuard.tsx
│       ├── UserProfileModal.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── scroll-area.tsx
│       └── tabs.tsx
├── config
│   └── case-generation-prompts.ts
├── content
│   ├── .DS_Store
│   └── foundation-cases
│       ├── case-01-profit-tree.json
│       ├── case-02-mece-optimization.json
│       ├── case-03-turnaround.json
│       ├── case-04-growth.json
│       ├── case-05-market-entry.json
│       ├── case-06-customer-journey.json
│       ├── case-07-strategic-decision.json
│       ├── case-08-portfolio.json
│       ├── case-09-due-diligence.json
│       ├── case-10-pmi.json
│       ├── case-11-leadership.json
│       └── case-12-digitalization.json
├── contexts
│   └── AuthContext.tsx
├── data
│   ├── courses.ts
│   └── modules.ts
├── database
│   ├── check-rls-policies-fixed.sql
│   ├── check-rls-policies.sql
│   ├── complete-diagnosis.sql
│   ├── create-missing-profile.sql
│   ├── debug-session-mismatch.sql
│   ├── debug-user-conflict.sql
│   ├── fix-admin-role.sql
│   ├── fix-id-conflict.sql
│   ├── fix-id-mismatch.sql
│   ├── manual-user-migration.sql
│   ├── migrate-christianmaass-only.sql
│   ├── migrate-existing-users.sql
│   ├── migrations
│   │   ├── 001_foundation_track_rollback.sql
│   │   ├── 001_foundation_track_setup.sql
│   │   ├── 002_add_case_question_field.sql
│   │   ├── 2025-08-08-add-course-access-indexes.sql
│   │   ├── add-enrollment-columns.sql
│   │   ├── add-multi-course-support-SAFE.sql
│   │   ├── add-multi-course-support.sql
│   │   ├── add-user-tracking.sql
│   │   ├── create-view.sql
│   │   ├── fix-foundation-cases-mapping.sql
│   │   ├── fix-user-christian.sql
│   │   ├── load_foundation_content.sql
│   │   ├── recreate-enrollment-table-clean.sql
│   │   ├── recreate-enrollment-table.sql
│   │   ├── seed_foundation_cases.sql
│   │   ├── test_foundation_schema.sql
│   │   └── user-tracking-migration.sql
│   ├── quick-admin-fix.sql
│   ├── schema.sql
│   ├── seed-data.sql
│   ├── seeds
│   │   └── test-user.sql
│   ├── set-admin-role-only.sql
│   ├── simple-email-update.sql
│   ├── tariff-schema.sql
│   ├── tariff-seed-data.sql
│   └── verify-admin-status.sql
├── dev
│   ├── .DS_Store
│   └── archive
│       ├── .DS_Store
│       └── pages
│           ├── .DS_Store
│           ├── admin
│           ├── check-enrollment-status.tsx
│           ├── check-my-user.tsx
│           ├── course
│           ├── onboarding-new-dev.tsx
│           ├── refresh-profile.tsx
│           ├── test-backend.tsx
│           ├── test-course-card.tsx
│           ├── test-login.tsx
│           ├── test-migration.tsx
│           ├── test-routing.tsx
│           ├── test-schema-check.tsx
│           ├── test-unified-guard-validation.tsx
│           ├── test-unified-guard.tsx
│           └── validate-schema.tsx
├── docs
│   ├── .DS_Store
│   ├── AP1-database-migration-spec.md
│   ├── ARCHITECTURE.md
│   ├── ROUTING.md
│   ├── adr
│   │   └── 2025-08-10-domain-structure-and-assets.md
│   ├── api-testing-plan.md
│   ├── archive
│   │   ├── auth-refactoring-plan.md
│   │   ├── auth-work-packages.md
│   │   ├── complete-schema-analysis.md
│   │   ├── database-schema-analysis.md
│   │   ├── navaa-auth-guidelines-v1.md
│   │   ├── navaa-lean-guidelines-v1.md
│   │   └── unified-guard-migration-guide.md
│   ├── auth-migration-matrix.md
│   ├── backend-api-migration-report.md
│   ├── deps-graph.svg
│   ├── foundation-content-structure.md
│   ├── foundation-track-architecture.md
│   ├── guideline-enforcement-strategies.md
│   ├── guides
│   │   └── assets.md
│   ├── manual-api-testing-guide.md
│   ├── multi-course-implementation-plan.md
│   ├── navaa-application-overview.md
│   ├── navaa-development-guidelines.md
│   ├── repo-structure.md
│   ├── reports
│   │   └── course-access-performance.md
│   ├── runbooks
│   │   ├── apply-access-index-migration.md
│   │   └── collect-course-access-metrics.md
│   ├── testing-policy.md
│   ├── unified-guard-migration-strategy.md
│   └── unified-guard-specification.md
├── hooks
│   ├── useProfile.ts
│   ├── useRouteGuard.ts
│   └── useUnifiedGuard.ts
├── index.html
├── lib
│   ├── assetPaths.ts
│   ├── guards
│   │   └── UnifiedGuard.tsx
│   ├── logger.ts
│   ├── middleware
│   │   ├── auth.ts
│   │   └── routing.ts
│   ├── pricing
│   │   ├── accessControl.ts
│   │   ├── config.ts
│   │   ├── service.ts
│   │   ├── strategies
│   │   │   ├── flatAccess.ts
│   │   │   └── perTrack.ts
│   │   └── types.ts
│   ├── rateLimiter.ts
│   ├── schemas
│   │   ├── admin.schemas.ts
│   │   └── foundation.schemas.ts
│   └── user.ts
├── marketing
│   ├── .DS_Store
│   ├── assets
│   │   ├── navaa-learn-loop.png
│   │   └── navaa-lernansatz.png
│   ├── components
│   │   ├── .DS_Store
│   │   ├── layout
│   │   │   ├── MainApp.tsx
│   │   │   └── MarketingLayout.tsx
│   │   └── sections
│   │       ├── BenefitOverview.tsx
│   │       ├── CredentialsSection.tsx
│   │       ├── FAQSection.tsx
│   │       ├── HeroBanner.tsx
│   │       ├── TargetAudienceSection.tsx
│   │       └── TestimonialSection.tsx
│   ├── index.ts
│   └── pages
│       ├── HomePage.tsx
│       ├── ImpressumPage.tsx
│       ├── LernansatzPage.tsx
│       └── PricingPage.tsx
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── pages
│   ├── .DS_Store
│   ├── 404.tsx
│   ├── _app.tsx
│   ├── _error.tsx
│   ├── admin
│   │   ├── cases.tsx
│   │   ├── foundation-manager.tsx
│   │   ├── index.tsx
│   │   ├── logs.tsx
│   │   ├── monitoring.tsx
│   │   └── users.tsx
│   ├── api
│   │   ├── admin
│   │   │   ├── assess-voice-input.ts
│   │   │   ├── check-role.ts
│   │   │   ├── check-schema.ts
│   │   │   ├── check-user-migration.ts
│   │   │   ├── cleanup-expired.ts
│   │   │   ├── create-test-user-direct.ts
│   │   │   ├── create-test-user.ts
│   │   │   ├── delete-user
│   │   │   ├── evaluate-free-text.ts
│   │   │   ├── fix-my-user.ts
│   │   │   ├── generate-case.ts
│   │   │   ├── generate-content-module.ts
│   │   │   ├── generate-multiple-choice.ts
│   │   │   ├── get-content-module.ts
│   │   │   ├── get-decision.ts
│   │   │   ├── get-foundation-case.ts
│   │   │   ├── get-foundation-cases.ts
│   │   │   ├── get-module-config.ts
│   │   │   ├── get-multiple-choice.ts
│   │   │   ├── get-text-input.ts
│   │   │   ├── get-voice-input.ts
│   │   │   ├── login-as-test-user.ts
│   │   │   ├── logs.ts
│   │   │   ├── run-migration.ts
│   │   │   ├── safe-migration.ts
│   │   │   ├── save-decision.ts
│   │   │   ├── save-module-config.ts
│   │   │   ├── save-text-input.ts
│   │   │   ├── save-voice-input.ts
│   │   │   ├── update-case-content.ts
│   │   │   └── users.ts
│   │   ├── assess-response.ts
│   │   ├── assign-free-plan.ts
│   │   ├── cases
│   │   │   └── user-case-history.ts
│   │   ├── check-case-limit.ts
│   │   ├── check-case-types.ts
│   │   ├── courses
│   │   │   ├── [slug]
│   │   │   ├── enroll.ts
│   │   │   └── index.ts
│   │   ├── create-checkout-session.ts
│   │   ├── fix-database.ts
│   │   ├── foundation
│   │   │   ├── cases
│   │   │   ├── cases.ts
│   │   │   ├── generate-content.ts
│   │   │   ├── progress.ts
│   │   │   └── submit.ts
│   │   ├── generate-case.ts
│   │   ├── openai-proxy.ts
│   │   ├── rate-text.ts
│   │   ├── setup-supabase-auth.ts
│   │   ├── stripe-webhook.ts
│   │   ├── submit-response.ts
│   │   ├── test-case-generation.ts
│   │   ├── test-user
│   │   │   └── [userId].ts
│   │   ├── user
│   │   │   ├── delete-account.ts
│   │   │   ├── track-activity.ts
│   │   │   ├── update-profile.ts
│   │   │   └── welcome-status.ts
│   │   └── user-tariff.ts
│   ├── app
│   │   ├── .DS_Store
│   │   ├── course
│   │   │   └── strategy-track.tsx
│   │   ├── foundation
│   │   │   ├── .DS_Store
│   │   │   ├── case
│   │   │   └── index.tsx
│   │   ├── lernfortschritt.tsx
│   │   ├── onboarding.tsx
│   │   └── settings.tsx
│   ├── course
│   │   └── [slug].tsx
│   ├── impressum.tsx
│   ├── index.tsx
│   ├── lernansatz.tsx
│   ├── login.tsx
│   ├── payment-success.tsx
│   ├── preise.tsx
│   └── register.tsx
├── payments
│   ├── components
│   │   ├── .gitkeep
│   │   ├── PaymentModal.tsx
│   │   └── PaymentSuccessView.tsx
│   ├── index.ts
│   ├── services
│   │   ├── checkout.ts
│   │   ├── freePlan.ts
│   │   ├── stripe.service.ts
│   │   └── userTariff.ts
│   ├── types
│   │   └── index.ts
│   └── webhooks
│       └── stripe.webhook.ts
├── postcss.config.js
├── public
│   ├── .DS_Store
│   ├── .gitkeep
│   ├── favicon.ico
│   └── shared
│       ├── .DS_Store
│       ├── brand
│       │   └── logo-navaa.png
│       ├── catalog
│       │   ├── cfo-track.png
│       │   ├── communication.png
│       │   ├── hard-decisions.png
│       │   ├── ki-manager.png
│       │   ├── negotiation.png
│       │   ├── po-track.png
│       │   └── strategy-track.png
│       └── modules
│           ├── expertcase.png
│           ├── foundationcase.png
│           └── onboarding.png
├── scripts
│   ├── MANUAL-SQL-MIGRATION.sql
│   ├── add-case-type-framework-hints.sql
│   ├── add-missing-columns.sql
│   ├── add-module-configuration.sql
│   ├── add-step-configuration.sql
│   ├── add-user-isolation-to-module-tables.sql
│   ├── check-admin-status.js
│   ├── cleanup-sql-files.sh
│   ├── create-case-content-modules-table.sql
│   ├── create-case-decisions-table.sql
│   ├── create-case-free-text-table.sql
│   ├── create-case-multiple-choice-simple.sql
│   ├── create-case-multiple-choice-table.sql
│   ├── create-case-text-inputs-table.sql
│   ├── create-case-voice-inputs-table.sql
│   ├── create-update-function.sql
│   ├── debug-content-modules-table.sql
│   ├── debug-foundation-cases.js
│   ├── debug-text-input-data.sql
│   ├── enterprise-foundation-cases-rls.sql
│   ├── execute-case-type-migration.js
│   ├── final-case-type-migration.sql
│   ├── final-rls-cleanup.sql
│   ├── fix-foundation-cases-rls.sql
│   ├── fix-foundation-cases-update.sql
│   ├── foundation-production-setup.sql
│   ├── make-user-admin.sql
│   ├── openai-proxy.js
│   ├── quick-insert-foundation-cases.sql
│   ├── seed-foundation-cases.sql
│   ├── setup-supabase-auth.sql
│   ├── simple-schema-refresh.sql
│   ├── stable-foundation-cases-rls.sql
│   ├── stable-schema-refresh.sql
│   ├── test-apis-simple.js
│   └── test-foundation-apis.js
├── services
│   └── CaseGenerationService.ts
├── sql
├── src
│   ├── .DS_Store
│   └── layout
│       ├── basic
│       │   ├── AppLayout.tsx
│       │   ├── AppShell.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── Footer.tsx
│       │   ├── Header.tsx
│       │   ├── MainApp.tsx
│       │   ├── MarketingLayout.tsx
│       │   └── Meta.tsx
│       ├── index.ts
│       └── partials
├── styles
│   └── globals.css
├── supabase
│   ├── email-templates
│   │   ├── confirmation.html
│   │   └── recovery.html
│   └── migrations
│       └── create_test_user_function.sql
├── supabaseClient.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.tsbuildinfo
├── types
│   ├── case.types.ts
│   ├── courses.ts
│   ├── foundation.types.ts
│   ├── module-configuration.types.ts
│   └── unified-module.types.ts
├── utils
│   └── greeting.ts
├── vite.config.ts
└── windsurf_deployment.yaml

112 directories, 507 files
