import { TransactionMode } from './../components/transaction-form/transaction-form.component';
import { Injectable, inject, signal } from '@angular/core';
import { PageResponse } from '../../../core/models/api-response.model';
import { ClientResponse } from '../../../core/models/compte-courant.model';
import { firstValueFrom } from 'rxjs';
import { ClientService } from '../services/client.service';
import { CreateClientRequest } from '../models/client-request.model';
import { ClientDetailResponse } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientStore {
  private readonly clientService = inject(ClientService);

  // --- STATE SIGNALS ---
  private readonly _clientsPage = signal<PageResponse<ClientResponse> | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _currentSearchTerm = signal<string>('');
  private readonly _selectedClient = signal<ClientDetailResponse | null>(null);
  private readonly _showInactive = signal<boolean>(false);

  // --- READONLY SIGNALS ---
  readonly clientsPage = this._clientsPage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentSearchTerm = this._currentSearchTerm.asReadonly();
  readonly selectedClient = this._selectedClient.asReadonly();
  readonly showInactive = this._showInactive.asReadonly();

  // --- ACTIONS ---
  async loadClients(poissonnerieId: number, page: number = 0) {
    // 1. TODO: Set isLoading to true, error to null
    this._isLoading.set(true);
    this._error.set(null);


    try {
      // 2. TODO: Await the service call using firstValueFrom
      // Hint: const response = await firstValueFrom(this.clientService.getClients(poissonnerieId, page));
      const response = await firstValueFrom(this.clientService.getClients(poissonnerieId, page));

      // 3. TODO: Update the _clientsPage signal with response.data
      this._clientsPage.set(response.data);


    } catch (err) {
      // 4. TODO: Set the error signal to a message
      this._error.set('Erreur lors du chargement des clients. Veuillez réessayer.');

    } finally {
      // 5. TODO: Set isLoading to false
      this._isLoading.set(false);
    }
  }

  async loadClientDetail(clientId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    this._selectedClient.set(null);

    try {
      const response = await firstValueFrom(this.clientService.getClientDetail(clientId));
      this._selectedClient.set(response.data);
    } catch (err) {
      this._error.set('Failed to load client details.');
    } finally {
      this._isLoading.set(false);
    }
  }

  //search Clients
  async searchClients(poissonnerieId:number, term: string, page: number = 0){
    this._isLoading.set(true);
    this._error.set(null);
    this._currentSearchTerm.set(term);

    try{
      const response  = await firstValueFrom(this.clientService.searchClients(poissonnerieId, term, page));
      this._clientsPage.set(response.data);
    } catch (err) {
      this._error.set('Erreur lors de la recherche de clients. Veuillez réessayer.');
    } finally {
      this._isLoading.set(false);
    }
  }

  async createClient(data: CreateClientRequest){
    this._isLoading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(this.clientService.createClient(data));

      //reload the first page of clients to see the new one!
      await this.loadClients(data.poissonnerieId, 0);
    } catch (err){
      this._error.set('Erreur lors de la création du client. Veuillez réessayer.');
    } finally {
      this._isLoading.set(false);
    }

  }

  async executeTransaction(action: TransactionMode, amount: number, notes: string | undefined){
     const client = this._selectedClient();
     if(!client) return;

     this._isLoading.set(true);
     this._error.set(null);

     try {
      switch (action){
        case 'emprunt':
          await firstValueFrom(this.clientService.enregistrerEmprunt({compteCourantId: client.compteCourantId, montant: amount, description: notes}));
          break;

        case 'remboursement':
          await firstValueFrom(this.clientService.enregistrerRemboursement({compteCourantId: client.compteCourantId, montant: amount, description: notes} as any));
          break;

        case 'depot':
          await firstValueFrom(this.clientService.faireDepot({epargneId: client.epargneId, amount}));
          break;

        case 'retrait':
          await firstValueFrom(this.clientService.faireRetrait({epargneId: client.epargneId, amount}));
          break;
      }
      await this.loadClientDetail(client.id);

    }catch (err){
      this._error.set('Erreur lors de la transaction. Veuillez réessayer.');
      throw err;
    } finally{
      this._isLoading.set(false);
     }

  }


  async openCompteCourant() {
    const client = this._selectedClient();
    if (!client) return;
    this._isLoading.set(true);
    try {
      await firstValueFrom(this.clientService.createCompteCourant(client.id));
      await this.loadClientDetail(client.id); // Refresh the page!
    } catch (err) {
      console.error(err);
    } finally {
      this._isLoading.set(false);
    }
  }

  async openEpargne() {
    const client = this._selectedClient();
    if (!client) return;
    this._isLoading.set(true);
    try {
      await firstValueFrom(this.clientService.createEpargne(client.id));
      await this.loadClientDetail(client.id); // Refresh the page!
    } catch (err) {
      console.error(err);
    } finally {
      this._isLoading.set(false);
    }
  }


  async modifierLimite(nouvelleLimite: number) {
    const client = this._selectedClient();
    if (!client || !client.compteCourantId) return;

    this._isLoading.set(true);
    try {
      // Call the service method (you might need to create this in ClientService!)
      await firstValueFrom(this.clientService.modifierLimiteCredit({
          compteCourantId: client.compteCourantId,
          nouvelleLimite: nouvelleLimite
        }));
      } finally {
        this._isLoading.set(false);
      }
  }


  async deleteClient(clientId: number){
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clientService.deleteClient(clientId));

      // Reload the current page of clients!
      const currentPage = this.clientsPage();
      if (currentPage && currentPage.content.length > 0) {
        // We assume all clients on the page belong to the same poissonnerie
        const poissonnerieId = currentPage.content[0].poissonnerie.id;
        await this.loadClients(poissonnerieId, currentPage.number);
      }
    } catch (err){
      this._error.set('Erreur lors de la désactivation du client.');
      throw err; // Important to throw so the UI knows it failed
    } finally {
      this._isLoading.set(false);
    }
  }

  async updateClient(clientId: number, data: any){
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clientService.updateClient(clientId, data));

      // Reload the current page of clients!
      const currentPage = this.clientsPage();
      if (currentPage && currentPage.content.length > 0) {
        const poissonnerieId = currentPage.content[0].poissonnerie.id;
        await this.loadClients(poissonnerieId, currentPage.number);
      }
    } catch (err){
      this._error.set('Erreur lors de la mise à jour du client.');
      throw err;
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadInactiveClients(poissonnerieId: number, page: number = 0) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      // DIRECTIVE: Call the service and update the signal
      const response = await firstValueFrom(this.clientService.getInactiveClients(poissonnerieId, page));
      this._clientsPage.set(response.data);
    } catch (err) {
      this._error.set('Erreur lors du chargement des clients inactifs.');
    } finally {
      this._isLoading.set(false);
    }
  }

  // Add this method to toggle the filter
  toggleFilter(poissonnerieId: number, showInactive: boolean) {
    this._showInactive.set(showInactive);
    if (showInactive) {
      this.loadInactiveClients(poissonnerieId, 0);
    } else {
      this.loadClients(poissonnerieId, 0);
    }
  }

  async reactivateClient(clientId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clientService.reactivateClient(clientId));

      // Reload the current page
      const currentPage = this.clientsPage();
      if (currentPage && currentPage.content.length > 0) {
        const poissonnerieId = currentPage.content[0].poissonnerie.id;
        // If we are looking at inactive clients, reload the inactive list
        if (this._showInactive()) {
          await this.loadInactiveClients(poissonnerieId, currentPage.number);
        } else {
          await this.loadClients(poissonnerieId, currentPage.number);
        }
      }
    } catch (err) {
      this._error.set('Erreur lors de la réactivation du client.');
      throw err;
    } finally {
      this._isLoading.set(false);
    }
  }


}
