import { Command } from "commander";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerBackupCommand } from "./register.backup.js";

const mocks = vi.hoisted(() => ({
  backupCreateCommand: vi.fn(),
  backupRestoreCommand: vi.fn(),
  backupVerifyCommand: vi.fn(),
  runtime: {
    log: vi.fn(),
    error: vi.fn(),
    exit: vi.fn(),
  },
}));

const backupCreateCommand = mocks.backupCreateCommand;
const backupRestoreCommand = mocks.backupRestoreCommand;
const backupVerifyCommand = mocks.backupVerifyCommand;
const runtime = mocks.runtime;

vi.mock("../../commands/backup.js", () => ({
  backupCreateCommand: mocks.backupCreateCommand,
}));

vi.mock("../../commands/backup-restore.js", () => ({
  backupRestoreCommand: mocks.backupRestoreCommand,
}));

vi.mock("../../commands/backup-verify.js", () => ({
  backupVerifyCommand: mocks.backupVerifyCommand,
}));

vi.mock("../../runtime.js", () => ({
  defaultRuntime: mocks.runtime,
}));

describe("registerBackupCommand", () => {
  async function runCli(args: string[]) {
    const program = new Command();
    registerBackupCommand(program);
    await program.parseAsync(args, { from: "user" });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    backupCreateCommand.mockResolvedValue(undefined);
    backupRestoreCommand.mockResolvedValue(undefined);
    backupVerifyCommand.mockResolvedValue(undefined);
  });

  it("runs backup create with forwarded options", async () => {
    await runCli(["backup", "create", "--output", "/tmp/backups", "--json", "--dry-run"]);

    expect(backupCreateCommand).toHaveBeenCalledWith(
      runtime,
      expect.objectContaining({
        output: "/tmp/backups",
        json: true,
        dryRun: true,
        verify: true,
        onlyConfig: false,
        includeWorkspace: true,
      }),
    );
  });

  it("honors --no-include-workspace", async () => {
    await runCli(["backup", "create", "--no-include-workspace"]);

    expect(backupCreateCommand).toHaveBeenCalledWith(
      runtime,
      expect.objectContaining({
        includeWorkspace: false,
      }),
    );
  });

  it("honors --no-verify", async () => {
    await runCli(["backup", "create", "--no-verify"]);

    expect(backupCreateCommand).toHaveBeenCalledWith(
      runtime,
      expect.objectContaining({
        verify: false,
      }),
    );
  });

  it("forwards --only-config to backup create", async () => {
    await runCli(["backup", "create", "--only-config"]);

    expect(backupCreateCommand).toHaveBeenCalledWith(
      runtime,
      expect.objectContaining({
        onlyConfig: true,
      }),
    );
  });

  it("runs backup verify with forwarded options", async () => {
    await runCli(["backup", "verify", "/tmp/openclaw-backup.tar.gz", "--json"]);

    expect(backupVerifyCommand).toHaveBeenCalledWith(
      runtime,
      expect.objectContaining({
        archive: "/tmp/openclaw-backup.tar.gz",
        json: true,
      }),
    );
  });

  it("runs backup restore with forwarded options", async () => {
    await runCli(["backup", "restore", "/tmp/openclaw-backup.tar.gz", "--dry-run", "--json"]);

    expect(backupRestoreCommand).toHaveBeenCalledWith(
      runtime,
      expect.objectContaining({
        archive: "/tmp/openclaw-backup.tar.gz",
        dryRun: true,
        yes: false,
        json: true,
      }),
    );
  });
});
