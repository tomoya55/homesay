declare module "mdns-js" {
    import { EventEmitter } from "events";
    export const version: string;
    export const name: string;
    export class Browser extends EventEmitter {
        constructor(networking: any, serviceType: string | ServiceType);
        serviceType: string | ServiceType;
        stop(): void;
        discover(): void;
    }
    export class Advertisement {
        start(): void;
        stop(next: () => void): void;
    }
    export function createBrowser(serviceType: string | ServiceType): Browser;
    export function excludeInterface(iface: string): void;
    export function createAdvertisement(
        serviceType: string,
        port: number,
        options: { name: string; [key: string]: any }
    ): Advertisement;
    export class ServiceType {
        constructor(
            serviceType:
                | string
                | {
                      name: string;
                      protocol: string;
                      subtypes?: string[];
                  }
        );
        constructor(name: string, protocol: string, ...subtypes: string[]);
        getDescription(): string;
        isWildcard(): boolean;
        toString(): string;
        fromString(): void;
        toArray(): string[];
        fromArray(): void;
        fromJSON(): void;
        matches(): boolean;
    }
    export function makeServiceType(
        serviceType:
            | string
            | {
                  name: string;
                  protocol: string;
                  subtypes?: string[];
              }
            | ServiceType
    ): ServiceType;
    export function makeServiceType(
        name: string,
        protocol: string,
        ...subtypes: string[]
    ): ServiceType;
    export function tcp(
        serviceType:
            | string
            | {
                  name: string;
                  protocol: string;
                  subtypes?: string[];
              }
            | ServiceType
    ): ServiceType;
    export function tcp(
        name: string,
        protocol: string,
        ...subtypes: string[]
    ): ServiceType;
    export function udp(
        serviceType:
            | string
            | {
                  name: string;
                  protocol: string;
                  subtypes?: string[];
              }
            | ServiceType
    ): ServiceType;
    export function udp(
        name: string,
        protocol: string,
        ...subtypes: string[]
    ): ServiceType;
}
